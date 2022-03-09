import { BigNumber } from 'bignumber.js'

import { tokenPrecision, TokenUnitType, unitPrecision, UnitType } from './convertProperties'

BigNumber.set({ EXPONENTIAL_AT: 1000 })

export function convertUnit<T extends string>(
  value: string,
  fromUnit: T,
  toUnit: T,
  precisionDict: PrecisionDict<T>,
): string | undefined {
  return new BigNumber(value)
    .times(unitPrecisionToValue(precisionDict[fromUnit]))
    .div(unitPrecisionToValue(precisionDict[toUnit]))
    .toString()
}

export function convertEthUnits(value: string, fromUnit: UnitType, toUnit: UnitType): string | undefined {
  return convertUnit(value, fromUnit, toUnit, unitPrecision)
}

export function convertTokenUnits(value: string, fromUnit: TokenUnitType, toUnit: TokenUnitType): string | undefined {
  return convertUnit(value, fromUnit, toUnit, tokenPrecision)
}

export type PrecisionDict<T extends string> = { [key in T]: number }

export function unitPrecisionToValue(precision: number): string {
  if (precision === 1) return '1'
  return ['1'].concat('0'.repeat(precision)).join('')
}
