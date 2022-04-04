import { BigNumber } from '@ethersproject/bignumber';

export function decodeHex(value: string): string {
  if (isHex(value)) {
    value = value.toLowerCase();
    return BigNumber.from(value).toString();
  } else {
    return value;
  }
}

export function encodeHex(value: string): string {
  if (value === '0x') value = '0x0';
  if (!isHex(value)) {
    return BigNumber.from(value).toHexString();
  } else {
    return value;
  }
}

export function isHex(value: string): boolean {
  return new RegExp(/0[xX][0-9a-fA-F]+/).test(value);
}
