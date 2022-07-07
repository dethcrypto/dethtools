import { FunctionFragment } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, mockFn } from 'earljs';

import { unexpectedCall } from '../test/unexpectedCall';
import CalldataDecoder, { CalldataDecoderProps } from './calldata-decoder.page';
import { humanReadableAbi } from './fixtures/hreAbi';
import { jsonAbi } from './fixtures/jsonAbi';

describe(CalldataDecoder.name, () => {
  it('decodes and displays types and values correctly', async () => {
    const root = render(<CalldataDecoder fetchAndDecode={unexpectedCall} />);

    const calldataField = (await root.findByLabelText(
      'Calldata',
    )) as HTMLTextAreaElement;
    fireEvent.change(calldataField, {
      target: {
        value:
          '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      },
    });

    expect(calldataField.value).toEqual(
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    );

    userEvent.click(await root.findByText('ABI'));

    const abiField = (await root.findByLabelText(
      'text area for abi',
    )) as HTMLTextAreaElement;

    fireEvent.change(abiField, {
      target: {
        value: 'function transferFrom(address,address,uint256)',
      },
    });

    expect(abiField.value).toEqual(
      'function transferFrom(address,address,uint256)',
    );

    userEvent.click(await root.findByText('Decode'));

    const sigHash = (await root.findByText('Signature hash')!)
      .nextSibling as HTMLElement;

    expect(sigHash.innerHTML).toEqual(expect.stringMatching('0x23b872dd'));

    const correctTypes = ['address', 'address', 'uint256'];
    correctTypes.forEach((e, i) => {
      expect(e).toEqual(
        root.getByTestId(i).querySelector('#node-type')!.innerHTML,
      );
    });

    const correctDecoded = [
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
      '1000000000000000000',
    ];

    correctDecoded.forEach((e, i) => {
      expect(e).toEqual(
        root.getByTestId(i).querySelector('#node-value')?.innerHTML.trim()!,
      );
    });
  });

  it('decodes and displays ABI with nested parameters', async () => {
    const root = render(<CalldataDecoder fetchAndDecode={unexpectedCall} />);

    const calldataField = (await root.findByLabelText(
      'Calldata',
    )) as HTMLTextAreaElement;
    fireEvent.change(calldataField, {
      target: {
        value:
          '0x6a947f74000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000021c',
      },
    });

    expect(calldataField.value).toEqual(
      '0x6a947f74000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000021c',
    );

    userEvent.click(await root.findByText('ABI'));
    const abiField = (await root.findByLabelText(
      'text area for abi',
    )) as HTMLTextAreaElement;
    fireEvent.change(abiField, {
      target: {
        value:
          '[{"inputs":[{"components":[{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter3","type":"tuple"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter4","type":"tuple"}],"internalType":"struct MyType2","name":"myType","type":"tuple"},{"internalType":"uint256","name":"myUint","type":"uint256"}],"name":"store","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
      },
    });
    expect(abiField.value).toEqual(
      '[{"inputs":[{"components":[{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter3","type":"tuple"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"},{"components":[{"internalType":"uint256","name":"parameter1","type":"uint256"}],"internalType":"struct MyStruct1","name":"parameter2","type":"tuple"}],"internalType":"struct MyStruct2","name":"parameter4","type":"tuple"}],"internalType":"struct MyType2","name":"myType","type":"tuple"},{"internalType":"uint256","name":"myUint","type":"uint256"}],"name":"store","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
    );

    userEvent.click(await root.findByText('Decode'));

    const sigHash = (await root.findByText('Signature hash')!)
      .nextSibling as HTMLElement;

    expect(sigHash.innerHTML).toEqual(expect.stringMatching('0x6a947f74'));

    const correctValues = ['123', '540'];
    const correctTypes = ['uint256', 'uint256'];

    correctValues.forEach((e, i) => {
      expect(
        root.getByTestId(i).querySelector('#node-value')?.innerHTML!,
      ).toEqual(expect.stringMatching(e));
    });
    correctTypes.forEach((e, i) => {
      expect(
        root.getByTestId(i).querySelector('#node-type')?.innerHTML!,
      ).toEqual(expect.stringMatching(e));
    });
  });

  it('types calldata, enters correct hash signature, clicks decode btn and gets correct results', async () => {
    const calldata =
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000';

    const sigHash = '0x23b872dd';
    const fetchAndDecode = mockFn<
      Required<CalldataDecoderProps>['fetchAndDecode']
    >()
      .given(sigHash, calldata)
      .resolvesToOnce([
        {
          decoded: [BigNumber.from('0x551bd432803012645ac136ddd64dba72')],
          fragment: FunctionFragment.from('gasprice_bit_ether(int128)'),
          sigHash,
        },
        {
          decoded: [
            '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
            '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
            BigNumber.from('0x0de0b6b3a7640000'),
          ],
          fragment: FunctionFragment.from(
            'transferFrom(address,address,uint256)',
          ),
          sigHash,
        },
      ]);

    const root = render(<CalldataDecoder fetchAndDecode={fetchAndDecode} />);

    const calldataField = (await root.findByLabelText(
      'Calldata',
    )) as HTMLTextAreaElement;

    fireEvent.change(calldataField, {
      target: {
        value: calldata,
      },
    });

    expect(calldataField.value).toEqual(calldata);

    userEvent.click(root.getByText('Decode'));

    const decodedCalldataTree0 = await waitFor(() => {
      return root.getByTestId('decodedCalldataTree0');
    });
    const decodedCalldataTree1 = await waitFor(() => {
      return root.getByTestId('decodedCalldataTree1');
    });

    expect(
      decodedCalldataTree0.querySelector('#node-value')?.innerHTML!,
    ).toEqual(expect.stringMatching('113128875528814585960425018501245024882'));
    expect(
      decodedCalldataTree0.querySelector('#node-type')?.innerHTML!,
    ).toEqual(expect.stringMatching('int128'));
    expect(
      decodedCalldataTree1.querySelector('#node-value')?.innerHTML!,
    ).toEqual(
      expect.stringMatching('0x8ba1f109551bD432803012645Ac136ddd64DBA72'),
    );
    expect(
      decodedCalldataTree1.querySelector('#node-type')?.innerHTML!,
    ).toEqual(expect.stringMatching('address'));
  });

  it.skip('types wrong abi, gets error message', async () => {
    const root = render(<CalldataDecoder />);
    const abi = humanReadableAbi;

    userEvent.click(await root.findByText('ABI'));

    const abiField = (await root.findByLabelText(
      'text area for abi',
    )) as HTMLTextAreaElement;

    fireEvent.change(abiField, {
      target: {
        value: abi,
      },
    });

    expect(abiField.value).toEqual(abi);

    const abiError = await root.findByLabelText('raw abi error');

    expect(abiError.innerHTML).toEqual('');
  });

  it.skip('types wrong abi, gets error message', async () => {
    const root = render(<CalldataDecoder />);
    const abi = jsonAbi;

    userEvent.click(await root.findByText('ABI'));

    const abiField = (await root.findByLabelText(
      'text area for abi',
    )) as HTMLTextAreaElement;

    fireEvent.change(abiField, {
      target: {
        value: abi,
      },
    });

    expect(abiField.value).toEqual(abi);

    const abiError = await root.findByLabelText('raw abi error');

    expect(abiError.innerHTML).toEqual('');
  });

  it('types wrong calldata, gets error message', async () => {
    const root = render(<CalldataDecoder />);
    const calldataField = (await root.findByLabelText(
      'Calldata',
    )) as HTMLTextAreaElement;

    fireEvent.change(calldataField, {
      target: {
        value: 'ddd',
      },
    });

    expect(calldataField.value).toEqual('ddd');

    const calldataError = await root.findByLabelText('encoded calldata error');

    expect(calldataError.innerHTML).toEqual(
      expect.stringMatching(
        'The value must be a hexadecimal number, 0x-prefix is required',
      ),
    );
  });
});
