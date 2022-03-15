import { fireEvent, render } from '@testing-library/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event'
import { expect } from 'earljs'

import CalldataDecoder from './calldata-decoder.page'

describe(CalldataDecoder.name, () => {
  it('works', async () => {
    const root = render(<CalldataDecoder />)

    const calldataField = (await root.findByLabelText('Calldata')) as HTMLTextAreaElement
    fireEvent.change(calldataField, {
      target: {
        value:
          '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      },
    })
    expect(calldataField.value).toEqual(
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    )

    const abiField = (await root.findByLabelText('Human-readable ABI')) as HTMLTextAreaElement
    fireEvent.change(abiField, {
      target: {
        value: 'function transferFrom(address,address,uint256)',
      },
    })
    expect(abiField.value).toEqual('function transferFrom(address,address,uint256)')

    userEvent.click(await root.findByRole('button'))

    const sigHash = await root.findByTestId('sigHash')
    expect(sigHash.innerHTML.includes('0x23b872dd')).toBeTruthy()

    const correctTypes = ['address', 'address', 'uint256']
    const inputParam = await root.findAllByTestId('inputParam')
    inputParam.forEach((e, i) => {
      expect(e.innerHTML).toEqual(correctTypes[i])
    })

    const correctDecoded = [
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
      '0x0de0b6b3a7640000',
    ]
    const decoded = await root.findAllByTestId('decoded')
    decoded.forEach((e, i) => {
      expect(e.innerHTML.trim()).toEqual(correctDecoded[i])
    })
  })
  // @todo - write tests regarding to validation (to be impl.)
})
