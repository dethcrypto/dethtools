import { Interface } from '@ethersproject/abi';

export function encodeConstructor(iface: Interface, args: string[]): string {
  return iface.encodeDeploy(args);
}
