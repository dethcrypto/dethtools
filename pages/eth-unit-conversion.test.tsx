import { fireEvent, render } from '@testing-library/react'
import { expect } from 'earljs'

import EthUnitConversion from './eth-unit-conversion.page'

describe(EthUnitConversion.name, () => {
  it('sets wei field and gets a correct value in the rest of fields', async () => {
    const root = render(<EthUnitConversion />)

    const weiField = (await root.findByLabelText('wei')) as HTMLInputElement

    fireEvent.change(weiField, { target: { value: '10000000001000002333343' } })

    expect(weiField.value).toEqual('10000000001000002333343')

    const gweiField = (await root.findByLabelText('gwei')) as HTMLInputElement
    const ethField = (await root.findByLabelText('eth')) as HTMLInputElement

    expect(gweiField.value).toEqual('10000000001000.002333343')
    expect(ethField.value).toEqual('10000.000001000002333343')
  })

  it('sets gwei field and gets a correct value in the rest of fields', async () => {
    const root = render(<EthUnitConversion />)

    const gweiField = (await root.findByLabelText('gwei')) as HTMLInputElement

    fireEvent.change(gweiField, { target: { value: '14000' } })

    expect(gweiField.value).toEqual('14000')

    const weiField = (await root.findByLabelText('wei')) as HTMLInputElement
    const ethField = (await root.findByLabelText('eth')) as HTMLInputElement

    expect(weiField.value).toEqual('14000000000000')
    expect(ethField.value).toEqual('0.000014')
  })

  it('sets eth field and gets a correct value in the rest of fields', async () => {
    const root = render(<EthUnitConversion />)

    const ethField = (await root.findByLabelText('eth')) as HTMLInputElement

    fireEvent.change(ethField, { target: { value: '0.014' } })

    expect(ethField.value).toEqual('0.014')

    const gweiField = (await root.findByLabelText('gwei')) as HTMLInputElement
    const weiField = (await root.findByLabelText('wei')) as HTMLInputElement

    expect(gweiField.value).toEqual('14000000')
    expect(weiField.value).toEqual('14000000000000000')
  })

  it('sets correct gwei input, then adds chars, thus freezes calculation results in other fields', async () => {
    const root = render(<EthUnitConversion />)
    const gweiField = (await root.findByLabelText('gwei')) as HTMLInputElement
    const weiField = (await root.findByLabelText('wei')) as HTMLInputElement
    const ethField = (await root.findByLabelText('eth')) as HTMLInputElement

    fireEvent.change(gweiField, { target: { value: '140005.54' } })
    expect(gweiField.value).toEqual('140005.54')
    expect(weiField.value).toEqual('140005540000000')
    expect(ethField.value).toEqual('0.00014000554')

    fireEvent.change(gweiField, { target: { value: '140005.54/fa' } })
    expect(gweiField.value).toEqual('140005.54/fa')
    expect(weiField.value).toEqual('140005540000000')
    expect(ethField.value).toEqual('0.00014000554')
  })

  it('types letters and special signs to one of the fields and error gets displayed', async () => {
    const root = render(<EthUnitConversion />)
    const errorField = await root.findByTestId('error')
    const gweiField = (await root.findByLabelText('gwei')) as HTMLInputElement

    fireEvent.change(gweiField, { target: { value: '140fa,@' } })
    expect(errorField.innerHTML).toEqual(
      expect.stringMatching("The value mustn't contain letters or any special signs except dot"),
    )
    expect(gweiField.value).toEqual('140fa,@')

    fireEvent.change(gweiField, { target: { value: '' } })
    expect(errorField.innerHTML).toEqual(expect.stringMatching('The value must be bigger or equal to 1'))
  })

  it('types negative number and error gets displayed', async () => {
    const root = render(<EthUnitConversion />)
    const errorField = await root.findByTestId('error')
    const weiField = (await root.findByLabelText('wei')) as HTMLInputElement
    const gweiField = (await root.findByLabelText('gwei')) as HTMLInputElement

    fireEvent.change(gweiField, { target: { value: '-12' } })

    expect(errorField.innerHTML).toEqual(
      expect.stringMatching("The value mustn't contain letters or any special signs except dot"),
    )
    expect(gweiField.value).toEqual('-12')
    expect(weiField.value).toEqual('')
  })
})
