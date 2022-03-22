import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'earljs'

import CalldataDecoder from './calldata-decoder.page'

describe(CalldataDecoder.name, () => {
  it('decodes and displays types and values correctly', async () => {
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

    const abiField = (await root.findByLabelText('ABI')) as HTMLTextAreaElement
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
    correctTypes.forEach((e, i) => {
      expect(e).toEqual(root.getByTestId(i).querySelector('#node-type')?.innerHTML.trim()!)
    })

    const correctDecoded = [
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
      '1000000000000000000',
    ]

    correctDecoded.forEach((e, i) => {
      expect(e).toEqual(root.getByTestId(i).querySelector('#node-value')?.innerHTML.trim()!)
    })
  })

  it('decodes and displays ABI with nested parameters', async () => {
    const root = render(<CalldataDecoder />)

    const calldataField = (await root.findByLabelText('Calldata')) as HTMLTextAreaElement
    fireEvent.change(calldataField, {
      target: {
        value:
          '0x6a947f74000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000021c',
      },
    })

    expect(calldataField.value).toEqual(
      '0x6a947f74000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000021c',
    )

    const abiField = (await root.findByLabelText('ABI')) as HTMLTextAreaElement
    fireEvent.change(abiField, {
      target: {
        value:
          '[{"inputs":[{"components":[{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter3","type":"tuple"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter4","type":"tuple"}],"internalType":"struct MyType2","name":"myType","type":"tuple"},{"internalType":"uint256","name":"myUint","type":"uint256"}],"name":"store","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
      },
    })
    expect(abiField.value).toEqual(
      '[{"inputs":[{"components":[{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter3","type":"tuple"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter4","type":"tuple"}],"internalType":"struct MyType2","name":"myType","type":"tuple"},{"internalType":"uint256","name":"myUint","type":"uint256"}],"name":"store","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
    )

    userEvent.click(await root.findByRole('button'))

    const sigHash = await root.findByTestId('sigHash')

    expect(sigHash.innerHTML).toEqual(expect.stringMatching('0x6a947f74'))

    const correctValues = ['123', '540']
    const correctTypes = ['uint256', 'uint256']

    correctValues.forEach((e, i) => {
      expect(root.getByTestId(i).querySelector('#node-value')?.innerHTML!).toEqual(expect.stringMatching(e))
    })
    correctTypes.forEach((e, i) => {
      expect(root.getByTestId(i).querySelector('#node-type')?.innerHTML!).toEqual(expect.stringMatching(e))
    })
  })
})
