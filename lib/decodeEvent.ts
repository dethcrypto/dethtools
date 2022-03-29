import { EventFragment, FormatTypes, Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'

export interface EventProps {
  topics: string[]
  data: string
}

interface AbstractDecodedEventResult {
  eventFragment: EventFragment
  hasArgumentNames: boolean
  signature: string
  fullSignature: string
}

export interface DecodedEventResultWithArgNames extends AbstractDecodedEventResult {
  hasArgumentNames: true
  args: Record<string, string | BigNumber>
}

export interface DecodedEventResultWithoutArgNames extends AbstractDecodedEventResult {
  hasArgumentNames: false
  args: ReadonlyArray<string | BigNumber>
}

export type DecodedEventResult = DecodedEventResultWithArgNames | DecodedEventResultWithoutArgNames

export function decodeEvent(iface: Interface, eventProps: EventProps): DecodedEventResult | undefined {
  try {
    const decoded = iface.parseLog(eventProps)
    const hasArgumentNames = doesContainNamedKeys(decoded.args)
    const decodedEventResult = {
      args: hasArgumentNames ? omitNonNamedKeys(decoded.args) : decoded.args,
      eventFragment: decoded.eventFragment,
      hasArgumentNames,
      signature: decoded.signature,
      fullSignature: decoded.eventFragment.format(FormatTypes.full),
    }
    return decodedEventResult as DecodedEventResult
  } catch (e: any) {
    switch (e.reason) {
      case 'no matching event':
        return undefined
      case 'data out-of-bounds':
        // At this point we know that we have a matching topic, but the number of indexed args is incorrect
        console.log(3, eventProps)
        return undefined
      default:
        throw e
    }
  }
}

export function tryToDecodeEvent(iface: Interface, eventProps: EventProps): DecodedEventResult | undefined {
  const indexedArgsCount = eventProps.topics.length - 1
  const topichash = eventProps.topics[0]
  for (const name in iface.events) {
    if (topichash === iface.getEventTopic(name)) {
      console.log(1, name, indexedArgsCount)
    }
  }
}

export function decodeEventNoGuessing(iface: Interface, eventProps: EventProps): DecodedEventResult | undefined {
  try {
    const decoded = iface.parseLog(eventProps)
    const hasArgumentNames = doesContainNamedKeys(decoded.args)
    const decodedEventResult = {
      args: hasArgumentNames ? omitNonNamedKeys(decoded.args) : decoded.args,
      eventFragment: decoded.eventFragment,
      hasArgumentNames,
      signature: decoded.signature,
      fullSignature: decoded.eventFragment.format(FormatTypes.full),
    }
    return decodedEventResult as DecodedEventResult
  } catch (e: any) {
    switch (e.reason) {
      case 'no matching event':
        return undefined
      case 'data out-of-bounds':
        return undefined
      default:
        throw e
    }
  }
}

// @internal
export function omitNonNamedKeys<T extends object>(object: T): Record<string, string | BigNumber> | T {
  const obj: Record<string, string | BigNumber> = {}
  for (const [key, val] of Object.entries(object)) {
    if (isNaN(parseInt(key))) {
      obj[key] = val
    }
  }
  return obj
}

// @internal
export function doesContainNamedKeys<T extends object>(object: T): boolean {
  return Object.keys(object).some((key) => isNaN(parseInt(key)))
}
