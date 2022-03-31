import { isHex } from './decodeHex';

export function prefixHexIf0xMissing(data: string): string {
  if (!isHex(data)) return '0x' + data;
  else return data;
}
