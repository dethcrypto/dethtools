import { render } from '@testing-library/react';
import { expect } from 'earljs';

import { changeTargetValue } from '../../test/helpers/changeTargetValue';
import StringBytes32Conversion from './index.page';

describe(StringBytes32Conversion.name, () => {
  it('gets error on wrong bytes32 input', () => {
    const root = render(<StringBytes32Conversion />);
    const bytes32Field = root.getByPlaceholderText(
      'Enter a hexadecimal value',
    ) as HTMLInputElement;

    {
      changeTargetValue(bytes32Field, '0x1234');

      const error = root.getAllByRole('alert')[0];

      expect(error.textContent).toEqual('Invalid bytes32 - not 32 bytes long');
    }
    {
      changeTargetValue(bytes32Field, '0x1234!');

      const error = root.getAllByRole('alert')[0];

      expect(error.textContent).toEqual('Invalid arrayify value');
    }
    {
      changeTargetValue(
        bytes32Field,
        '0x1234123412341234123412341234123412341234123412341234123412341234',
      );

      const error = root.getAllByRole('alert')[0];

      expect(error.textContent).toEqual(
        'Invalid bytes32 string - no null terminator',
      );
    }
  });

  it('converts string to bytes32', () => {
    const root = render(<StringBytes32Conversion />);
    const stringField = root.getByPlaceholderText(
      'Enter a string',
    ) as HTMLInputElement;

    changeTargetValue(stringField, 'Hello world!');

    const bytes32Field = root.getByPlaceholderText(
      'Enter a hexadecimal value',
    ) as HTMLInputElement;

    expect(bytes32Field.value).toEqual(
      '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000',
    );
  });

  it('converts bytes32 to string', () => {
    const root = render(<StringBytes32Conversion />);
    const bytes32Field = root.getByPlaceholderText(
      'Enter a hexadecimal value',
    ) as HTMLInputElement;

    changeTargetValue(
      bytes32Field,
      '0x3078313230303030303030300000000000000000000000000000000000000000',
    );

    const stringField = root.getByPlaceholderText(
      'Enter a string',
    ) as HTMLInputElement;

    expect(stringField.value).toEqual('0x1200000000');
  });

  it('clears error when string is now empty', () => {
    const root = render(<StringBytes32Conversion />);
    const bytes32Field = root.getByPlaceholderText(
      'Enter a hexadecimal value',
    ) as HTMLInputElement;

    changeTargetValue(
      bytes32Field,
      '0x626c756562657272790000000000000000000000000000000000000000000000',
    );

    changeTargetValue(bytes32Field, '');

    expect(() => root.getAllByRole('alert')[0]).toThrow();
  });

  it('flushes other field when the current one is modified (bytes => string)', () => {
    const root = render(<StringBytes32Conversion />);
    const bytes32Field = root.getByPlaceholderText(
      'Enter a hexadecimal value',
    ) as HTMLInputElement;

    changeTargetValue(
      bytes32Field,
      '0x626c756562657272790000000000000000000000000000000000000000000000',
    );

    changeTargetValue(bytes32Field, '');

    const stringField = root.getByPlaceholderText(
      'Enter a string',
    ) as HTMLInputElement;

    expect(stringField.value).toEqual('');
  });

  it('flushes other field when the current one is modified (string => bytes)', () => {
    const root = render(<StringBytes32Conversion />);
    const stringField = root.getByPlaceholderText(
      'Enter a string',
    ) as HTMLInputElement;

    changeTargetValue(stringField, 'Hello world');

    changeTargetValue(stringField, '');

    const bytes32Field = root.getByPlaceholderText(
      'Enter a hexadecimal value',
    ) as HTMLInputElement;

    expect(bytes32Field.value).toEqual('');
  });
});
