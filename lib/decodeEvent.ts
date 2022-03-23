import { EventFragment, Interface, Result } from '@ethersproject/abi'

export function decodeEvent(iface: Interface, eventProps: EventProps): DecodeEventResult | undefined {
  const { data, topics } = eventProps
  const events = iface.events

  let decodedTopics: Result | Record<string, unknown> | undefined
  let eventFragment: [string, EventFragment] | undefined

  for (const event of Object.entries(events)) {
    const name = event[1].name
    try {
      decodedTopics = iface.decodeEventLog(name, data, topics)
      eventFragment = event
    } catch (e) {}
  }
  if (decodedTopics && eventFragment) {
    let isNamedResult = false
    if (doContainsNamedKeys(decodedTopics)) {
      isNamedResult = true
      decodedTopics = filterNonNamedKeys(decodedTopics)
    }
    return { decodedTopics, eventFragment, isNamedResult }
  }
}

export interface EventProps {
  topics: readonly string[]
  data: string
}

export interface DecodeEventResult {
  decodedTopics: Result | Record<string, unknown>
  eventFragment: [string, EventFragment]
  isNamedResult: boolean
}

// @internal
export function filterNonNamedKeys<T extends object>(object: T): Record<string, unknown> | T {
  const obj: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(object)) {
    if (isNaN(parseInt(key))) {
      obj[key] = val
    }
  }
  return obj
}

// @internal
export function doContainsNamedKeys<T extends object>(object: T): boolean {
  return Object.keys(object).some((key) => isNaN(parseInt(key)))
}
