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
    expect(sigHash.innerHTML).toEqual(expect.stringMatching('0x23b872dd'))

    const correctTypes = ['address', 'address', 'uint256']
    const inputParam = await root.findAllByTestId('inputParam')
    correctTypes.forEach((e, i) => {
      expect(e).toEqual(inputParam[i].innerHTML)
    })

    const correctDecoded = [
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
      '0x0de0b6b3a7640000',
    ]
    const decoded = await root.findAllByTestId('decoded')
    correctDecoded.forEach((e, i) => {
      expect(e).toEqual(decoded[i].innerHTML.trim())
    })
  })
  // @todo - write tests regarding to validation (to be impl.)
})
