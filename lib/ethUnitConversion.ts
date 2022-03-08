import { BigNumber } from 'bignumber.js'

BigNumber.set({ EXPONENTIAL_AT: 1000 })

export type UnitType = 'wei' | 'gwei' | 'eth'

const unitPrecision: { [key in UnitType]: number } = {
  wei: 1,
  gwei: 9,
  eth: 18,
}

export function unitPrecisionToValue(precision: number): string {
  if (precision === 1) return '1'
  return ['1'].concat('0'.repeat(precision)).join('')
}

export function convertUnit(value: string, fromUnit: UnitType, toUnit: UnitType): string | undefined {
  return new BigNumber(value)
    .times(unitPrecisionToValue(unitPrecision[fromUnit]))
    .div(unitPrecisionToValue(unitPrecision[toUnit]))
    .toString()
}
