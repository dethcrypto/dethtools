import BigNumber from 'bignumber.js'

export enum UnitType {
  WEI,
  GWEI,
  ETH,
}

export interface Unit {
  type: UnitType
  value: string
}

function fromWei(wei: BigNumber) {
  return { gwei: wei.pow(-9), eth: wei.pow(-18) }
}

// function fromGwei(gwei: Unit) {
//   return { gwei: Math.pow(wei.value, -9), eth: Math.pow(wei.value, -18) }
// }

// function fromEth() {
//   return { gwei: Math.pow(wei.value, -9), eth: Math.pow(wei.value, -18) }
// }

export function handleValueChange(unit: Unit) {
  const { type, value } = unit
  const convertedValue = new BigNumber(value)
  console.log('big number', convertedValue)

  const { gwei, eth } = fromWei(convertedValue)
  console.log(gwei.toString(), eth)

  // switch (type) {
  //   case UnitType.WEI:
  //     const gwei = Math.pow(unit, -9)
  //     const eth = Math.pow(unit, -18)
  //     return { gwei, eth }

  //   case UnitType.GWEI:
  //     const wei = Math.pow(unit, -9)
  //     const eth = Math.pow(unit, -18)
  //     return { wei, eth }

  //   case UnitType.ETH:
  //     const gwei = Math.pow(unit, -9)
  //     const eth = Math.pow(unit, -18)
  //     return { gwei, eth }
  // }
}
