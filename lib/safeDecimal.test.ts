import { expect } from 'earljs'

import { boundDecimal, DECIMAL_BOUND } from './safeDecimal'

describe(boundDecimal.name, () => {
  it('handles typical cases', () => {
    expect(boundDecimal(String(DECIMAL_BOUND + 5))).toEqual(DECIMAL_BOUND.toString())
    expect(boundDecimal(String(0 - 5))).toEqual(String(0))
  })
})
