import { addHexPrefix, padToEven, stripHexPrefix } from 'ethereumjs-util';

export function toEvenHex(str: string): string {
  return addHexPrefix(padToEven(stripHexPrefix(str)));
}
