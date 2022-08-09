import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'earljs';

import { changeTargetValue } from '../../test/helpers/changeTargetValue';
import ConstructorEncoder from './index.page';

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
  it('encodes constructor arguments correctly', () => {
    const root = render(<ConstructorEncoder />);

    const abiField = root.getByLabelText('ABI') as HTMLTextAreaElement;

    changeTargetValue(abiField, JSON.stringify(abi));

    expect(abiField.value).toEqual(JSON.stringify(abi));

    const oneField = root.getByLabelText(/one/) as HTMLInputElement;
    const twoField = root.getByLabelText(/two/) as HTMLInputElement;
    const threeField = root.getByLabelText(/three/) as HTMLInputElement;

    changeTargetValue(oneField, '0x42');
    changeTargetValue(twoField, '42');
    changeTargetValue(threeField, '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45');

    userEvent.click(root.getByText('Decode'));

    const encodedRows = root.getAllByLabelText('encoded-row');

    expect(encodedRows[0].textContent).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000042',
    );
    expect(encodedRows[1].textContent).toEqual(
      '000000000000000000000000000000000000000000000000000000000000002a',
    );
    expect(encodedRows[2].textContent).toEqual(
      '00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45',
    );
  });

  it('validates data correctly', () => {
    const root = render(<ConstructorEncoder />);

    const abiField = root.getByLabelText('ABI') as HTMLTextAreaElement;

    changeTargetValue(abiField, '{');

    expect(root.getByLabelText('abi decode error').textContent).toEqual(
      'ABI parsing failed: Unexpected end of JSON input',
    );

    changeTargetValue(abiField, JSON.stringify(abi));

    const oneField = root.getByLabelText(/one/) as HTMLInputElement;
    const threeField = root.getByLabelText(/three/) as HTMLInputElement;

    changeTargetValue(oneField, '0xqwerty');

    expect(root.getByRole('alert').textContent).toEqual(
      'invalid BigNumber string',
    );

    changeTargetValue(oneField, '0x42');
    changeTargetValue(threeField, '0x42');

    expect(root.getByRole('alert').textContent).toEqual('invalid address');
  });
});
