import { BigNumber } from '@ethersproject/bignumber'

export function decodeHex(value: string): string {
  const isHex = new RegExp(/0[xX][0-9a-fA-F]+/)

  if (isHex.test(value)) {
    value = value.toLowerCase()
    return BigNumber.from(value).toString()
  } else {
    return value
  }
}
