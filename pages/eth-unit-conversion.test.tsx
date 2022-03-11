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
})
