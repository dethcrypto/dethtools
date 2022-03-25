import { Interface } from '@ethersproject/abi'
import fetch from 'node-fetch'

import { sigHashSchema } from '../misc/sigHashSchema'
import { decodeCalldata, DecodeResult } from './decodeCalldata'
import { decodeEvent, EventProps } from './decodeEvent'
import { parseAbi } from './parseAbi'

export async function decodeWithEventProps(sigHash: string, eventProps: EventProps): Promise<any[] | undefined> {
  const data = await fetchSignaturesByTopic(sigHash)
  if (data) {
    // force indexing basing on topic count
    const ifaces = parse4BytesResToIfaces(data, 'event')
    return decodeByEventProps(ifaces, eventProps)
  }
}

export async function decodeWithCalldata(sigHash: string, calldata: string): Promise<DecodeResult[] | undefined> {
  const data = await fetchSignaturesByCalldata(sigHash)
  if (data) {
    const ifaces = parse4BytesResToIfaces(data)
    return decodeByCalldata(ifaces, calldata)
  }
}

export function sigHashFromCalldata(calldata: string): string | undefined {
  const chunk = calldata.slice(0, 10)
  if (sigHashSchema.safeParse(chunk).success) {
    return chunk
  }
}

export type FetchResult = {
  id: number
  text_signature: string
  bytes_signature: string
  created_at: string
  hex_signature: string
}

// @internal
export async function fetch4BytesData(hexSig: string, hexSigType: HexSigType): Promise<FetchResult[] | undefined> {
  return JSON.parse(await fetch(`${urlTo(hexSigType)}${hexSig}`).then((response) => response.text())).results
}

// @internal
function urlTo(hexSigType: HexSigType): string {
  return `https://www.4byte.directory/api/v1/${hexSigType}/?hex_signature=`
}

// @internal
// there are more types, but we don't need them for now
type HexSigType = 'signatures' | 'event-signatures'

// @internal
export async function fetchSignaturesByCalldata(sigHash: string) {
  return fetch4BytesData(sigHash, 'signatures')
}

// @internal
export async function fetchSignaturesByTopic(sigHash: string) {
  return fetch4BytesData(sigHash, 'event-signatures')
}

// @internal
export function parse4BytesResToIfaces(
  data: FetchResult[],
  defaultKeyword: string = 'function',
  // @notice how many params should be changed to indexed (basing on given topic count)
  indexArgs?: number,
): Interface[] {
  const ifaces: Interface[] = []

  for (const result of data) {
    const frag = result.text_signature

    let parsed: Interface | Error
    try {
      parsed = parseAbi(frag, defaultKeyword)
      if (parsed instanceof Interface) ifaces.push(parsed)
    } catch (e) {}
  }
  return ifaces
}

// @internal
export function decodeByEventProps(ifaces: Interface[], eventProps: EventProps) {
  return decode4BytesData(ifaces, eventProps, decodeEvent)
}

// @internal
export function decodeByCalldata(ifaces: Interface[], calldata: string): DecodeResult[] {
  return decode4BytesData(ifaces, calldata, decodeCalldata)
}

// @internal
export function decode4BytesData<T extends unknown, R>(
  ifaces: Interface[],
  data: T,
  decodeFn: (iface: Interface, data: T) => R | undefined,
): R[] {
  const decoded: R[] = []
  for (const iface of ifaces) {
    const decodeResult = decodeFn(iface, data)
    if (decodeResult) decoded.push(decodeResult)
  }
  return decoded
}
