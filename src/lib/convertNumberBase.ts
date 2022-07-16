import BigNumber from 'bignumber.js';

import { NumberBaseType } from './numberBaseConvertProperties';

export function convertNumberBase(
  value: string,
  fromUnit: NumberBaseType,
  toUnit: NumberBaseType,
): string | undefined {
  for (const [fromBaseName, fromBaseNumber] of Object.entries(
    numberBaseConversionDict,
  )) {
    if (fromBaseName === fromUnit) {
      for (const [toBaseName, toBaseNumber] of Object.entries(
        numberBaseConversionDict,
      )) {
        if (toBaseName === toUnit) {
          return convertNumberBaseWithBn(
            value,
            toBaseName,
            fromBaseNumber,
            toBaseNumber,
          );
        }
      }
    }
  }
}

// @internal
const numberBaseConversionDict = {
  binary: 2,
  octal: 8,
  decimal: 10,
  hexadecimal: 16,
};

// @internal
function convertNumberBaseWithBn(
  value: string,
  toBaseName: string,
  from: number,
  to: number,
): string {
  if (toBaseName === 'octal') {
    return '0' + new BigNumber(value, from).toString(to);
  } else if (toBaseName === 'hexadecimal') {
    return '0x' + new BigNumber(value, from).toString(to);
  } else {
    return new BigNumber(value, from).toString(to);
  }
}
