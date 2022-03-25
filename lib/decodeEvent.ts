import { EventFragment, FormatTypes, Fragment, Interface, Result } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'

export function decodeEvent(iface: Interface, eventProps: EventProps): DecodeEventResult | undefined {
  const { data, topics } = eventProps

  const indexedIface = attachIndexedToJson(iface.format(FormatTypes.json), topics.length - 1)
  const events = indexedIface.fragments

  let decodedTopics: Result | Record<string, string | BigNumber> | undefined
  let eventFragment: [string, Fragment | EventFragment] | undefined

  for (const event of Object.entries(events)) {
    try {
      decodedTopics = indexedIface.decodeEventLog(event[1] as EventFragment, data, topics)
      eventFragment = event
    } catch (e) {}
  }

  if (decodedTopics && eventFragment) {
    let isNamedResult = false
    if (doesContainsNamedKeys(decodedTopics)) {
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
  decodedTopics: Result | Record<string, string | BigNumber>
  eventFragment: [string, Fragment | EventFragment]
  isNamedResult: boolean
}

// @internal
export function attachIndexedToJson(json: string | string[], topicCount: number): Interface {
  let parsed
  if (typeof json === 'string') {
    parsed = JSON.parse(json)
    return new Interface(attachIndexes(parsed, topicCount))
  } else {
    const parsed = []
    for (const str of json) {
      parsed.push(JSON.parse(str))
    }
    return new Interface(attachIndexes(parsed, topicCount))
  }
}

// @internal
function attachIndexes<T extends Fragment[]>(array: T, topicCount: number): T[number][] {
  const myArray = [...array]

  for (const frag of myArray) {
    let indexedLeft = topicCount
    for (const input of frag.inputs) {
      if (indexedLeft <= 0) break
      Object.assign(input, { indexed: true })
      indexedLeft -= 1
    }
  }
  return myArray
}

// @internal
export function filterNonNamedKeys<T extends object>(object: T): Record<string, string | BigNumber> | T {
  const obj: Record<string, string | BigNumber> = {}
  for (const [key, val] of Object.entries(object)) {
    if (isNaN(parseInt(key))) {
      obj[key] = val
    }
  }
  return obj
}

// @internal
export function doesContainsNamedKeys<T extends object>(object: T): boolean {
  return Object.keys(object).some((key) => isNaN(parseInt(key)))
}
