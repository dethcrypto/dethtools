import { Interface } from '@ethersproject/abi';
import fetch from 'node-fetch';

import { hexSchema } from '../misc/schemas/hexSchema';
import { decodeCalldata, DecodeResult } from './decodeCalldata';
import { DecodedEventResult, decodeEvent, EventProps } from './decodeEvent';
import { parseAbi } from './parseAbi';

export async function decodeWithCalldata(
  sigHash: string,
  calldata: string,
): Promise<DecodeResult[] | undefined> {
  const response = await fetch4BytesBy.Signatures(sigHash);
  if (response) {
    const ifaces = parse4BytesResToIfaces(response);
    const decodedByCalldata = decodeByCalldata(ifaces, calldata);
    if (decodedByCalldata.length === 0 && ifaces.length > 0) {
      return [{ decoded: [], fragment: ifaces[0].fragments[0], sigHash }];
    } else {
      return decodedByCalldata;
    }
  }
}

export async function decodeWithEventProps(
  sigHash: string,
  eventProps: EventProps,
): Promise<DecodedEventResult[] | undefined> {
  const response = await fetch4BytesBy.EventProps(sigHash);
  if (response) {
    const ifaces = parse4BytesResToIfaces(response, 'event');
    return decode4BytesData(ifaces, eventProps, decodeEvent);
  }
}

export function sigHashFromCalldata(calldata: string): string | undefined {
  const chunk = calldata.slice(0, 10);
  if (hexSchema.safeParse(chunk).success) {
    return chunk;
  }
}

export const fetch4BytesBy = {
  EventProps: async (sigHash: string) => {
    return fetch4Bytes(sigHash, 'event-signatures');
  },
  Signatures: async (sigHash: string) => {
    return fetch4Bytes(sigHash, 'signatures');
  },
};

async function fetch4Bytes(
  hexSig: string,
  hexSigType: HexSigType,
): Promise<FourBytes[] | undefined> {
  const { results } = await safeFetch<FourBytesResponse>(
    `${urlTo(hexSigType)}${hexSig}`,
  );
  return results;
}

// @internal
// there are more types, but we don't need them for now
export type HexSigType = 'signatures' | 'event-signatures';

// @internal
function urlTo(hexSigType: HexSigType): string {
  return `https://www.4byte.directory/api/v1/${hexSigType}/?hex_signature=`;
}

// @internal
export function parse4BytesResToIfaces(
  data: FourBytes[],
  defaultKeyword: string = 'function',
): Interface[] {
  const ifaces: Interface[] = [];
  for (const result of data) {
    const frag = result.text_signature;
    let parsed: Interface | Error;
    try {
      parsed = parseAbi(frag, defaultKeyword);
      if (parsed instanceof Interface) ifaces.push(parsed);
    } catch (e) {}
  }
  return ifaces;
}

async function safeFetch<T>(...args: Parameters<typeof fetch>): Promise<T> {
  return fetch(...args).then(async (response) => {
    if (response.status === 200) {
      return response.json() as unknown as T;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  });
}

interface FourBytes {
  id: number;
  text_signature: string;
  bytes_signature: string;
  created_at: string;
  hex_signature: string;
}

interface FourBytesResponse {
  count: number;
  next: unknown;
  previous: unknown;
  results: FourBytes[];
}

// @internal
export function decodeByCalldata(
  ifaces: Interface[],
  calldata: string,
): DecodeResult[] {
  return decode4BytesData(ifaces, calldata, decodeCalldata);
}

// @internal
export function decode4BytesData<T extends unknown, R>(
  ifaces: Interface[],
  data: T,
  decodeFn: (iface: Interface, data: T) => R | undefined,
): R[] {
  const decoded: R[] = [];
  for (const iface of ifaces) {
    const decodeResult = decodeFn(iface, data);
    if (decodeResult) decoded.push(decodeResult);
  }
  return decoded;
}
