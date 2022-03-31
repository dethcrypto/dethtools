import { isHex } from './decodeHex';

export function toEvenHex(str: string): string {
  if (isHex(str)) {
    if (str[2] === '0') {
      return str;
    }
    str = str.slice(2, str.length);
    if (str.length % 2 !== 0) {
      return '0x0' + str;
    } else {
      return '0x' + str;
    }
  } else {
    if (str.length % 2 !== 0) {
      return '0' + str;
    }
  }
  return str;
}
