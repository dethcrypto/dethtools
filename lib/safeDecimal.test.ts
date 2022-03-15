import { expect } from 'earljs'

import { boundDecimal, DECIMAL_BOUND } from './safeDecimal'

describe(boundDecimal.name, () => {
  it('handles typical cases', () => {
    expect(boundDecimal(`${DECIMAL_BOUND + 5}`)).toEqual(`${DECIMAL_BOUND}`)
    expect(boundDecimal(`${0 - 5}`)).toEqual('0')
  })
})
