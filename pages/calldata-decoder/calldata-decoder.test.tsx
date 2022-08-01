import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'earljs';
import sinon from 'sinon';

import { fetch4BytesBy } from '../../src/lib/decodeBySigHash';
import { abiForToggleTest } from '../fixtures/abiForToggleTest';
import { humanReadableAbi } from '../fixtures/hreAbi';
import { jsonAbi } from '../fixtures/jsonAbi';
import CalldataDecoder from './index.page';

describe(CalldataDecoder.name, () => {
  afterEach(() => {
    sinon.restore();
  });

  it('decodes and displays types and values correctly', async () => {
    const root = render(<CalldataDecoder />);

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
    const root = render(<CalldataDecoder />);

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

  it('decodes with abi and calldata and gets correct function', async () => {
    const root = render(<CalldataDecoder />);

    const calldataField = (await root.findByLabelText(
      'Calldata',
    )) as HTMLTextAreaElement;

    fireEvent.change(calldataField, {
      target: {
        value:
          '0xda9581b600000000000000000000000000000000000000000000000000000000000000870000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000b44616e6733722337313634000000000000000000000000000000000000000000',
      },
    });

    userEvent.click(await root.findByText('ABI'));

    const abiField = (await root.findByLabelText(
      'text area for abi',
    )) as HTMLTextAreaElement;

    fireEvent.change(abiField, {
      target: {
        value:
          '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":true,"internalType":"address","name":"_address","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"_name","type":"string"}],"name":"EnterRaffle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":true,"internalType":"address","name":"_address","type":"address"},{"indexed":false,"internalType":"string","name":"_name","type":"string"}],"name":"PurchaseWL","type":"event"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"bool","name":"_capped","type":"bool"}],"name":"addRaffle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"addWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cocoAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"bool","name":"_capped","type":"bool"},{"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"editRaffle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_capped","type":"bool"}],"name":"editRaffleAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"editRaffleEnd","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"editRafflePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"editWLAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"editWLPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"editWLTimestamp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"editWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"string","name":"_name","type":"string"}],"name":"enterRaffle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getRaffle","outputs":[{"components":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"bool","name":"capped","type":"bool"}],"internalType":"struct CocoMarketplaceV2.Raffle","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getWhitelist","outputs":[{"components":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct CocoMarketplaceV2.Whitelist","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address","name":"_address","type":"address"}],"name":"hasPurchasedRaffle","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address","name":"_address","type":"address"}],"name":"hasPurchasedWL","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"isCappedRaffle","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_name","type":"string"}],"name":"purchase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"raffleCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"raffleTimer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_cocoAddress","type":"address"}],"name":"setCocoAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_time","type":"uint256"}],"name":"setRaffleTimer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_time","type":"uint256"}],"name":"setWhitelistTimer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"skipRaffleIndex","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"whitelistCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whitelistTimer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]',
      },
    });

    userEvent.click(await root.findByText('Decode'));

    expect(root.getByLabelText('function type').textContent).toEqual(
      expect.stringMatching('function'),
    );
    expect(root.getByLabelText('function name').textContent).toEqual(
      expect.stringMatching('purchase'),
    );
  });

  it('types calldata, enters correct hash signature, clicks decode btn and gets correct results', async () => {
    const calldata =
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000';
    sinon.stub(fetch4BytesBy, 'Signatures').returns(
      Promise.resolve([
        {
          id: 31781,
          created_at: '2018-05-12T20:40:45.467194Z',
          text_signature: 'gasprice_bit_ether(int128)',
          hex_signature: '0x23b872dd',
          bytes_signature: '#¸rÝ',
        },
        {
          id: 147,
          created_at: '2016-07-09T03:58:28.927638Z',
          text_signature: 'transferFrom(address,address,uint256)',
          hex_signature: '0x23b872dd',
          bytes_signature: '#¸rÝ',
        },
      ]),
    );

    const root = render(<CalldataDecoder />);

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

    const decodedCalldataTree = await waitFor(() => {
      return root.getByTestId('decodedCalldataTree0');
    });

    expect(
      decodedCalldataTree.querySelector('#node-value')?.innerHTML!,
    ).toEqual(
      expect.stringMatching('0x8ba1f109551bD432803012645Ac136ddd64DBA72'),
    );
    expect(decodedCalldataTree.querySelector('#node-type')?.innerHTML!).toEqual(
      expect.stringMatching('address'),
    );
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

  it('types wrong abi, gets error message', async () => {
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

    expect(abiError.innerHTML).toEqual('invalid event string ');
  });

  it('toggle changes value format', async () => {
    const root = render(<CalldataDecoder />);

    const calldataField = (await root.findByLabelText(
      'Calldata',
    )) as HTMLTextAreaElement;

    fireEvent.change(calldataField, {
      target: {
        value:
          '0xda9581b600000000000000000000000000000000000000000000000000000000000000870000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000b44616e6733722337313634000000000000000000000000000000000000000000',
      },
    });

    userEvent.click(await root.findByText('ABI'));

    const abiField = (await root.findByLabelText(
      'text area for abi',
    )) as HTMLTextAreaElement;

    fireEvent.change(abiField, {
      target: {
        value: abiForToggleTest,
      },
    });

    userEvent.click(await root.findByText('Decode'));

    {
      const toggle = root.getByLabelText('hex-dec toggle');
      const leftToggleButton = toggle.querySelector(
        'button[aria-label="left toggle button"]',
      ) as HTMLButtonElement;

      fireEvent.click(leftToggleButton);

      const decodedValue = root.getAllByLabelText('decoded value')[0].innerHTML;

      expect(decodedValue).toEqual('0x87');
    }
    {
      const toggle = root.getByLabelText('bytes32-string toggle');
      const leftToggleButton = toggle.querySelector(
        'button[aria-label="left toggle button"]',
      ) as HTMLButtonElement;

      fireEvent.click(leftToggleButton);

      const decodedValue = root.getAllByLabelText('decoded value')[1].innerHTML;

      expect(decodedValue).toEqual(
        '0x44616e6733722337313634000000000000000000000000000000000000000000',
      );
    }
  });
});
