export const DECIMAL_BOUND = 26
export const DEFAULT_DECIMAL = '18'

export function boundDecimal(str: string) {
  return boundStrInt(str, DECIMAL_BOUND)
}

// @internal
export function boundStrInt<T extends string>(str: T, topBound: number, botBound: number = 0): string {
  if (parseInt(str) >= topBound) {
    return topBound.toString()
  } else if (parseInt(str) <= 0) {
    return botBound.toString()
  } else {
    return str
  }
}
