import { expect } from 'earljs'
import { convertUnit } from './ethUnitConversion'

describe('ethUnitConversion', () => {
  it('performs common conversion', () => {
    expect(convertUnit('12', 'wei', 'wei')).toEqual('12')
    expect(convertUnit('12', 'wei', 'gwei')).toEqual('0.000000012')
    expect(convertUnit('12', 'wei', 'eth')).toEqual('0.000000000000000012')

    expect(convertUnit('12', 'gwei', 'gwei')).toEqual('12')
    expect(convertUnit('12', 'gwei', 'wei')).toEqual('12000000000')
    expect(convertUnit('12', 'gwei', 'eth')).toEqual('0.000000012')

    expect(convertUnit('12', 'eth', 'eth')).toEqual('12')
    expect(convertUnit('12', 'eth', 'gwei')).toEqual('12000000000')
    expect(convertUnit('12', 'eth', 'wei')).toEqual('12000000000000000000')
  })

  it('performs really small unit conversion', () => {
    expect(convertUnit('0.00000412300033333300012', 'gwei', 'wei')).toEqual('4123') // !
    expect(convertUnit('12', 'gwei', 'eth')).toEqual('0.000000000000004123')

    expect(convertUnit('0.000000000000000030043311111001', 'eth', 'gwei')).toEqual('0.00000003')
    expect(convertUnit('0.000000000000000030043311111001', 'eth', 'wei')).toEqual('30')
  })

  it('performs untypical conversion', () => {
    expect(convertUnit('0.12', 'wei', 'eth')).toEqual('0.00000000000000000012') // !
  })
})
