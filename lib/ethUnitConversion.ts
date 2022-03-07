import { BigNumber } from 'bignumber.js'

BigNumber.set({ EXPONENTIAL_AT: 1000 })

export type UnitType = 'wei' | 'gwei' | 'eth'

// @todo handle hex value 0x.. input

const unitPrecision: { [key in UnitType]: number } = {
  wei: 1,
  gwei: 9,
  eth: 18,
}

export function unitTypeToPrecision(unitType: UnitType): string | undefined {
  switch (unitType) {
    case 'eth':
      return unitPrecision.eth.toString()
    case 'gwei':
      return unitPrecision.gwei.toString()
    case 'wei':
      return unitPrecision.wei.toString()
    default:
      break
  }
}

export function unitPrecisionToValue(precision: string): string {
  if (parseInt(precision) === 1) return '1'
  return ['1'].concat('0'.repeat(parseInt(precision))).join('')
}

export function convertUnit(value: string, fromUnit: UnitType, toUnit: UnitType): string | undefined {
  const parsedFromUnit = unitTypeToPrecision(fromUnit)
  const parsedToUnit = unitTypeToPrecision(toUnit)

  if (parsedFromUnit && parsedToUnit) {
    const toValue = unitPrecisionToValue(parsedFromUnit)
    const fromValue = unitPrecisionToValue(parsedToUnit)
    return new BigNumber(value).times(toValue).div(fromValue).toString()
  }
}
