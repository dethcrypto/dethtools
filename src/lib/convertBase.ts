import BigNumber from 'bignumber.js';

import { Base } from './convertBaseProperties';

export function convertBase(
  value: string,
  from: Base,
  to: Base,
): string | undefined {
  return convertBaseWithBn(value, to, baseNameToBase[from], baseNameToBase[to]);
}

// @internal
const baseNameToBase = {
  binary: 2,
  octal: 8,
  decimal: 10,
  hexadecimal: 16,
};

// @internal
const baseNameToPrefix: Partial<Record<Base, string>> = {
  octal: '0',
  hexadecimal: '0x',
};

// @internal
function convertBaseWithBn(
  value: string,
  toBaseName: Base,
  from: number,
  to: number,
): string {
  return (
    String(baseNameToPrefix[toBaseName] || '') +
    new BigNumber(value, from).toString(to)
  );
}
