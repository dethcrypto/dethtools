import { BigNumber } from 'bignumber.js';

import { unitPrecision, UnitType } from './convertProperties';

BigNumber.set({ EXPONENTIAL_AT: 1000, DECIMAL_PLACES: 1000 });

export type PrecisionDict<T extends string> = { [key in T]: number };

export function convertEthUnits(
  value: string,
  fromUnit: UnitType,
  toUnit: UnitType,
): string | undefined {
  return convertUnit(value, fromUnit, toUnit, unitPrecision);
}

// @internal
export function convertUnit<T extends string>(
  value: string,
  fromUnit: T,
  toUnit: T,
  precisionDict: PrecisionDict<T>,
): string | undefined {
  return new BigNumber(value)
    .times(unitPrecisionToValue(precisionDict[fromUnit]))
    .div(unitPrecisionToValue(precisionDict[toUnit]))
    .toString();
}

// @internal
export function unitPrecisionToValue(precision: number): string {
  if (precision < 0) return '0';
  return ['1'].concat('0'.repeat(precision)).join('');
}
