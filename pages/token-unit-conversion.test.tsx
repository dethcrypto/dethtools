import { fireEvent, render } from '@testing-library/react'
import { expect } from 'earljs'

import TokenUnitConversion from './token-unit-conversion.page'

describe(TokenUnitConversion.name, () => {
  it.skip('sets defualt value, thus user can calculate values without getting NaN', async () => {
    const root = render(<TokenUnitConversion />)

    const decimalsField = (await root.findByLabelText(/decimals/i)) as HTMLInputElement

    const unitField = (await root.findByLabelText(/unit/i)) as HTMLInputElement
    fireEvent.change(unitField, { target: { value: '1' } })

    expect(decimalsField.placeholder).not.toEqual('NaN')
    expect(decimalsField.value).not.toEqual('NaN')
  })

  it('sets decimals, changes base and gets a correct value in unit field', async () => {
    const root = render(<TokenUnitConversion />)
    const decimalsField = (await root.findByLabelText(/decimals/i)) as HTMLInputElement

    fireEvent.change(decimalsField, { target: { value: '10' } })

    expect(decimalsField.value).toEqual('10')

    const unitField = (await root.findByLabelText(/unit/i)) as HTMLInputElement
    const baseField = (await root.findByLabelText(/base/i)) as HTMLInputElement

    fireEvent.change(baseField, { target: { value: '9' } })
    expect(unitField.value).toEqual(String(9e10))
  })

  it('sets decimals, changes unit and gets a correct value in base field', async () => {
    const root = render(<TokenUnitConversion />)
    const decimalsField = (await root.findByLabelText(/decimals/i)) as HTMLInputElement

    fireEvent.change(decimalsField, { target: { value: '5' } })
    expect(decimalsField.value).toEqual('5')

    const unitField = (await root.findByLabelText(/unit/i)) as HTMLInputElement
    const baseField = (await root.findByLabelText(/base/i)) as HTMLInputElement

    fireEvent.change(unitField, { target: { value: String(15e5) } })
    expect(baseField.value).toEqual('15')
  })
})
