import { Interface } from '@ethersproject/abi'
import fetch from 'node-fetch'

import { sigHashSchema } from '../misc/sigHashSchema'
import { decodeCalldata, DecodeResult } from './decodeCalldata'
import { parseAbi } from './parseAbi'

const HEX_SIG_API_URL = 'https://www.4byte.directory/api/v1/signatures/?hex_signature='

export async function decodeBySigHash(sigHash: string, calldata: string): Promise<DecodeResult[] | undefined> {
  const data = await fetchData(sigHash)
  if (data) {
    const ifaces = parseData(data)
    return decodeData(ifaces, calldata)
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
export async function fetchData(sigHash: string): Promise<FetchResult[] | undefined> {
  return JSON.parse(await fetch(`${HEX_SIG_API_URL}${sigHash}`).then((response) => response.text())).results
}

// @internal
export function parseData(data: FetchResult[]): Interface[] {
  const ifaces: Interface[] = []

  for (const result of data) {
    const frag = result.text_signature

    let parsed: Interface | Error
    try {
      parsed = parseAbi(frag)
      if (parsed instanceof Interface) ifaces.push(parsed)
    } catch (e) {}
  }
  return ifaces
}

// @internal
export function decodeData(ifaces: Interface[], calldata: string): DecodeResult[] {
  const decoded: DecodeResult[] = []

  for (const iface of ifaces) {
    const decodeResult = decodeCalldata(iface, calldata)
    if (decodeResult) decoded.push(decodeResult)
  }
  return decoded
}
