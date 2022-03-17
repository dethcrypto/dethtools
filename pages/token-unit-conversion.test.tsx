import { fireEvent, render } from '@testing-library/react'
import { expect } from 'earljs'

import TokenUnitConversion from './token-unit-conversion.page'

describe(TokenUnitConversion.name, () => {
  it('sets defualt value, thus user can calculate values without getting NaN', async () => {
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

  it('sets correct unit input, then adds chars, thus freezes calculation results in base field', async () => {
    const root = render(<TokenUnitConversion />)
    const unitField = (await root.findByLabelText('unit')) as HTMLInputElement
    const baseField = (await root.findByLabelText('base')) as HTMLInputElement

    fireEvent.change(unitField, { target: { value: '12444444000000000.55' } })
    expect(unitField.value).toEqual('12444444000000000.55')
    expect(baseField.value).toEqual('0.01244444400000000055')

    fireEvent.change(unitField, { target: { value: '12444444000000000.55/fa' } })
    expect(unitField.value).toEqual('12444444000000000.55/fa')
    expect(baseField.value).toEqual('0.01244444400000000055')
  })

  it('types letters and special signs to one of the fields and error gets displayed', async () => {
    const root = render(<TokenUnitConversion />)
    const errorField = await root.findByTestId('error')
    const baseField = (await root.findByLabelText('base')) as HTMLInputElement

    fireEvent.change(baseField, { target: { value: '140fa,@' } })
    expect(errorField.innerHTML).toEqual(expect.stringMatching(/The value mustn't contain letters/))

    fireEvent.change(baseField, { target: { value: '' } })
    expect(errorField.innerHTML).toEqual(expect.stringMatching(/The value must be bigger or equal to 1/))
  })

  it('recalculates values when decimals change', async () => {
    const root = render(<TokenUnitConversion />)
    const decimalsField = (await root.findByLabelText(/decimals/i)) as HTMLInputElement

    fireEvent.change(decimalsField, { target: { value: '10' } })

    expect(decimalsField.value).toEqual('10')

    const unitField = (await root.findByLabelText(/unit/i)) as HTMLInputElement
    const baseField = (await root.findByLabelText(/base/i)) as HTMLInputElement

    fireEvent.change(baseField, { target: { value: '9' } })
    expect(unitField.value).toEqual('90000000000')

    fireEvent.change(decimalsField, { target: { value: '15' } })

    expect(unitField.value).toEqual('9000000000000000')
  })
})
