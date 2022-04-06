/**
 * Ensures `value` is of a subtype of `Given` while preserving its exact type.
 *
 * @example
 * // const numbers: { one: number; two: number }
 * const numbers = constrain<Record<string, number>>()({ one: 1, two: 2 })
 *
 * @see https://kentcdodds.com/blog/how-to-write-a-constrained-identity-function-in-typescript
 */
export const constrain =
  <Given extends unknown>() =>
  <Inferred extends Given>(value: Inferred) =>
    value;
