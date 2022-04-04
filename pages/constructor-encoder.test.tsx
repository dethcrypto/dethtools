import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'earljs';

import ConstructorEncoder from './constructor-encoder.page';

const abi = [
  {
    inputs: [
      { internalType: 'uint256', name: 'one', type: 'uint256' },
      { internalType: 'uint8', name: 'two', type: 'uint8' },
      { internalType: 'address', name: 'three', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
];

describe(ConstructorEncoder.name, () => {
  it('encodes constructor arguments correctly', async () => {
    const root = render(<ConstructorEncoder />);

    const abiField = (await root.findByLabelText('ABI')) as HTMLTextAreaElement;
    fireEvent.change(abiField, {
      target: {
        value: JSON.stringify(abi),
      },
    });

    expect(abiField.value).toEqual(JSON.stringify(abi));

    const oneField = (await root.findByLabelText(/one/)) as HTMLInputElement;
    const twoField = (await root.findByLabelText(/two/)) as HTMLInputElement;
    const threeField = (await root.findByLabelText(
      /three/,
    )) as HTMLInputElement;
    fireEvent.change(oneField, {
      target: {
        value: '0x42',
      },
    });
    fireEvent.change(twoField, {
      target: {
        value: '42',
      },
    });
    fireEvent.change(threeField, {
      target: {
        value: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
      },
    });

    userEvent.click(await root.findByText('Decode'));

    expect((await root.findByTestId('encodedRow_0')).innerHTML).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000042',
    );
    expect((await root.findByTestId('encodedRow_1')).innerHTML).toEqual(
      '000000000000000000000000000000000000000000000000000000000000002a',
    );
    expect((await root.findByTestId('encodedRow_2')).innerHTML).toEqual(
      '00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45',
    );
  });
  it('validates data correctly', async () => {
    const root = render(<ConstructorEncoder />);

    const abiField = (await root.findByLabelText('ABI')) as HTMLTextAreaElement;
    fireEvent.change(abiField, {
      target: {
        value: '{',
      },
    });

    expect((await root.findByTestId('error')).innerHTML).toEqual(
      'ABI parsing failed: Unexpected end of JSON input',
    );
    fireEvent.change(abiField, {
      target: {
        value: JSON.stringify(abi),
      },
    });

    const oneField = (await root.findByLabelText(/one/)) as HTMLInputElement;
    const threeField = (await root.findByLabelText(
      /three/,
    )) as HTMLInputElement;
    fireEvent.change(oneField, {
      target: {
        value: '0xqwerty',
      },
    });
    expect((await root.findByRole('alert')).innerHTML).toEqual(
      'invalid BigNumber string',
    );
    fireEvent.change(oneField, {
      target: {
        value: '0x42',
      },
    });
    fireEvent.change(threeField, {
      target: {
        value: '0x42',
      },
    });
    expect((await root.findByRole('alert')).innerHTML).toEqual(
      'invalid address',
    );
  });
});
