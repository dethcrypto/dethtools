import { Fragment, Interface } from '@ethersproject/abi';
import assert from 'assert';

export function decodeCalldata(
  iface: Interface,
  calldata: string,
): DecodeResult | undefined {
  const abi = iface.fragments;

  let decoded: ReadonlyArray<unknown> | undefined;
  let fragment: Fragment | undefined;

  for (const frag of abi) {
    try {
      decoded = iface.decodeFunctionData(frag.name, calldata);
      const encoded = iface.encodeFunctionData(frag.name, decoded);
      assert(
        encoded === calldata,
        'Ignore functions that do not fully encode data',
      );
      fragment = frag;
    } catch (e) {
      // catch error here to avoid error throw,
      // as we want to check which fragment decodes successfully and save it
    }
  }

  if (decoded && fragment) {
    return { decoded, fragment, sigHash: iface.getSighash(fragment) };
  }
}

export interface Decoded extends ReadonlyArray<unknown> {}

export interface DecodeResult {
  decoded: Decoded;
  fragment: Fragment;
  sigHash: string;
}
