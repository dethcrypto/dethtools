import { fireEvent, render } from '@testing-library/react';
import { expect } from 'earljs';
import { changeTargetValue } from '../../test/helpers/changeTargetValue';

import TxDecoder from './index.page';

describe(TxDecoder.name, () => {
  it('decodes and displays transaction correctly', () => {
    const root = render(<TxDecoder />);
    const rawTxField = root.getByLabelText('raw transaction');

    changeTargetValue(rawTxField, '0x1234567890123456789012345678901234567890');

    const decodeButton = root.getByText('Decode');

    fireEvent.click(decodeButton);

    expect(root.findAllByLabelText('tx decoder results')).toBeDefined();
  });

  it('display error on wrong format', () => {
    const root = render(<TxDecoder />);

    const rawTxField = root.getByLabelText('raw transaction');

    changeTargetValue(rawTxField, '123');

    const decodeButton = root.getByText('Decode');

    fireEvent.click(decodeButton);

    expect(root.getByRole('alert').innerHTML).toEqual(
      'The value must be a hexadecimal number, 0x-prefix is required',
    );
  });

  it('display error on tx decode failure', () => {
    const root = render(<TxDecoder />);

    const rawTxField = root.getByLabelText('raw transaction');

    changeTargetValue(rawTxField, '0x123');

    const decodeButton = root.getByText('Decode');

    fireEvent.click(decodeButton);

    expect(root.getByRole('alert').innerHTML).toEqual(
      'Failed to decode transaction: Invalid serialized tx input: must be array',
    );
  });

  it('display error on tx decode failure (invalid remainder)', () => {
    const root = render(<TxDecoder />);

    const rawTxField = root.getByLabelText('raw transaction');

    changeTargetValue(rawTxField, '0x12345');

    const decodeButton = root.getByText('Decode');

    fireEvent.click(decodeButton);

    expect(root.getByRole('alert').innerHTML).toEqual(
      'Failed to decode transaction: invalid remainder',
    );
  });

  it('displays error on wrong value', () => {
    const root = render(<TxDecoder />);
    const rawTxField = root.getByLabelText('raw transaction');

    changeTargetValue(rawTxField, '0xA');

    const decodeButton = root.getByText('Decode');

    fireEvent.click(decodeButton);

    expect(root.getByRole('alert').innerHTML).toEqual(
      'Failed to decode transaction: TypedTransaction with ID 10 unknown',
    );
  });

  it('displays correct format (pretty)', () => {
    const root = render(<TxDecoder />);
    const rawTxField = root.getByLabelText('raw transaction');

    changeTargetValue(
      rawTxField,
      '0x02f8b10107843e95ba808501c7f9bc808301839a94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4880b844a9059cbb000000000000000000000000d6b42582b26f8b2c244c1ce1990262a06bda3d950000000000000000000000000000000000000000000000000000000033428f00c001a09a38e7cce7e0c3f38e90f1977d9c222e7280bc7d731c4194e0fd4a6e7460afeba0699c6073fcb27633b3250338229acb22e2e1f764a97122bc59e2a3b0a53fffc7',
    );

    const decodeButton = root.getByText('Decode');

    fireEvent.click(decodeButton);

    expect(root.getByLabelText('result in pretty format'));
  });

  it('displays correct format (json)', () => {
    const root = render(<TxDecoder />);
    const rawTxField = root.getByLabelText('raw transaction');

    changeTargetValue(
      rawTxField,
      '0x02f8b10107843e95ba808501c7f9bc808301839a94a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4880b844a9059cbb000000000000000000000000d6b42582b26f8b2c244c1ce1990262a06bda3d950000000000000000000000000000000000000000000000000000000033428f00c001a09a38e7cce7e0c3f38e90f1977d9c222e7280bc7d731c4194e0fd4a6e7460afeba0699c6073fcb27633b3250338229acb22e2e1f764a97122bc59e2a3b0a53fffc7',
    );

    const decodeButton = root.getByText('Decode');

    fireEvent.click(decodeButton);

    const rightToggleButton = root.getByLabelText(
      'pretty-json right toggle button',
    );

    expect(rightToggleButton.textContent).toEqual('json');

    fireEvent.click(rightToggleButton);

    expect(root.getByLabelText('result in json format'));
  });
});
