import { Interface } from '@ethersproject/abi';
import fetch from 'node-fetch';

import { hexSchema } from '../misc/schemas/hexSchema';
import { decodeCalldata, DecodeResult } from './decodeCalldata';
import { DecodedEventResult, decodeEvent, EventProps } from './decodeEvent';
import { parseAbi } from './parseAbi';

export async function decodeWithEventProps(
  sigHash: string,
  eventProps: EventProps,
): Promise<DecodedEventResult[] | undefined> {
  const data = await getSignaturesByTopic(sigHash);
  if (data) {
    // force indexing basing on topic count
    const ifaces = parse4BytesResToIfaces(data, 'event');
    return decode4BytesData(ifaces, eventProps, decodeEvent);
  }
}

export async function fetchAndDecodeWithCalldata(
  sigHash: string,
  calldata: string,
): Promise<DecodeResult[] | undefined> {
  const data = await getSignaturesByCalldata(sigHash);
  if (data) {
    const ifaces = parse4BytesResToIfaces(data);
    const decodedByCalldata = decodeByCalldata(ifaces, calldata);
    if (decodedByCalldata.length === 0 && ifaces.length > 0) {
      return [{ decoded: [], fragment: ifaces[0].fragments[0], sigHash }];
    } else {
      return decodedByCalldata;
    }
  }
}

export function sigHashFromCalldata(calldata: string): string | undefined {
  const chunk = calldata.slice(0, 10);
  if (hexSchema.safeParse(chunk).success) {
    return chunk;
  }
}

export type FetchResult = {
  id: number;
  text_signature: string;
  bytes_signature: string;
  created_at: string;
  hex_signature: string;
};

// @internal
// there are more types, but we don't need them for now
export type HexSigType = 'signatures' | 'event-signatures';

type Bytes4Cache = {
  [sigType in HexSigType]: {
    // undefined - not populated
    // [] - no results
    // [...] - results
    [sig: string]: FetchResult[] | undefined;
  };
};

const bytes4Cache: Bytes4Cache = {
  signatures: {},
  'event-signatures': {},
};

// @internal
export async function getBytes4Data(
  hexSig: string,
  hexSigType: HexSigType,
): Promise<FetchResult[] | undefined> {
  if (bytes4Cache[hexSigType][hexSig] === undefined) {
    await fetch4BytesData(hexSig, hexSigType);
  }
  return bytes4Cache[hexSigType][hexSig];
}

// @internal
export async function fetch4BytesData(
  hexSig: string,
  hexSigType: HexSigType,
): Promise<FetchResult[] | undefined> {
  const response = await fetch(`${urlTo(hexSigType)}${hexSig}`);
  const json = await response.json();
  return (bytes4Cache[hexSigType][hexSig] = json.results);
}

// @internal
function urlTo(hexSigType: HexSigType): string {
  return `https://www.4byte.directory/api/v1/${hexSigType}/?hex_signature=`;
}

// @internal
export async function getSignaturesByCalldata(
  sigHash: string,
): Promise<FetchResult[] | undefined> {
  return getBytes4Data(sigHash, 'signatures');
}

// @internal
export async function getSignaturesByTopic(
  sigHash: string,
): Promise<FetchResult[] | undefined> {
  return getBytes4Data(sigHash, 'event-signatures');
}

// @internal
export function parse4BytesResToIfaces(
  data: FetchResult[],
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
