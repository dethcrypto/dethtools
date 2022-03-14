import { Fragment, Interface } from '@ethersproject/abi'

interface DecodeResult {
  decoded: ReadonlyArray<unknown>
  fragment: Fragment
}

export function decodeCalldata(iface: Interface, calldata: string): DecodeResult | undefined {
  const abi = iface.fragments

  let decoded: ReadonlyArray<unknown> | undefined
  let fragment: Fragment | undefined

  for (const frag of abi) {
    try {
      decoded = iface.decodeFunctionData(frag.name, calldata)
      fragment = frag
    } catch (e) {}
  }
  if (decoded && fragment) {
    return { decoded, fragment }
  }
}
