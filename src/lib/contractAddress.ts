import { getContractAddress as getContractAddressImpl } from '@ethersproject/address';

export function getContractAddress(params: {
  from: string;
  nonce: string;
}): string {
  return getContractAddressImpl(params);
}
