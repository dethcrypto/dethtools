import BigNumber from 'bignumber.js';

import { NumberBaseType } from './numberBaseConvertProperties';

export function convertNumberBase(
  value: string,
  fromUnit: NumberBaseType,
  toUnit: NumberBaseType,
): string | undefined {
  switch (fromUnit) {
    case 'binary':
      switch (toUnit) {
        case 'binary':
          return value;
        case 'octal':
          return '0' + new BigNumber(value, 2).toString(8);
        case 'decimal':
          return new BigNumber(value, 2).toString(10);
        case 'hexadecimal':
          return '0x' + new BigNumber(value, 2).toString(16);
        default:
          return;
      }
    case 'octal':
      switch (toUnit) {
        case 'octal':
          return value;
        case 'binary':
          return new BigNumber(value, 8).toString(2);
        case 'decimal':
          return new BigNumber(value, 8).toString(10);
        case 'hexadecimal':
          return '0x' + new BigNumber(value, 8).toString(16);
        default:
          return;
      }
    case 'decimal':
      switch (toUnit) {
        case 'decimal':
          return value;
        case 'binary':
          return new BigNumber(value, 10).toString(2);
        case 'octal':
          return '0' + new BigNumber(value, 10).toString(8);
        case 'hexadecimal':
          return '0x' + new BigNumber(value, 10).toString(16);
        default:
          return;
      }
    case 'hexadecimal':
      switch (toUnit) {
        case 'hexadecimal':
          return value;
        case 'binary':
          return new BigNumber(value, 16).toString(2);
        case 'octal':
          return '0' + new BigNumber(value, 16).toString(8);
        case 'decimal':
          return new BigNumber(value, 16).toString(10);
        default:
          return;
      }
  }
}
