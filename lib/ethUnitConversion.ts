import { BigNumber } from 'bignumber.js'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'

export type UnitType = 'wei' | 'gwei' | 'eth'

BigNumber.set({ EXPONENTIAL_AT: 1000 })

export interface Unit {
  type: UnitType
  value: string
}

export type AnyNumber = BigNumber | EthersBigNumber | number
export type MyBigNumber = BigNumber

export type ConversionResult = {
  [key in UnitType]: string
}

// paste hex value 0x..

export function toMyBigNumber(n: AnyNumber): MyBigNumber {
  return new BigNumber(n.toString())
}

const units: { [key: string]: string } = {
  wei: '1',
  gwei: '1000000000',
  eth: '1000000000000000000',
}

function toWei(value: string, fromUnit: UnitType) {
  return new BigNumber(value).times(units[fromUnit]).div(units['wei']).toString()
}

function toGwei(value: string, fromUnit: UnitType) {
  return new BigNumber(value).times(units[fromUnit]).div(units['gwei']).toString()
}

function toEth(value: string, fromUnit: UnitType) {
  return new BigNumber(value).times(units[fromUnit]).div(units['eth']).toString()
}

export function convertUnit(value: string, fromUnit: UnitType, toUnit?: UnitType) {
  try {
    if (!toUnit) {
      if (fromUnit === 'eth') {
        return { wei: toWei(value, 'eth'), gwei: toGwei(value, 'eth') }
      } else if (fromUnit === 'gwei') {
        return { wei: toWei(value, 'gwei'), eth: toEth(value, 'gwei') }
      } else if (fromUnit === 'wei') {
        return { gwei: toGwei(value, 'wei'), eth: toEth(value, 'wei') }
      }
    } else {
      return new BigNumber(value).times(units[fromUnit]).div(units[toUnit]).toString()
    }
  } catch (e) {
    return undefined
  }
}
