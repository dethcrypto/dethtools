import { fireEvent, render } from '@testing-library/react';
import { expect } from 'earljs';

import NumberBaseConversion from './number-base-conversion.page';

describe(NumberBaseConversion.name, () => {
  it('sets binary and gets a correct value in other fields', async () => {
    const root = render(<NumberBaseConversion />);
    const binaryField = (await root.findByLabelText(
      /binary/i,
    )) as HTMLInputElement;
    const octalField = (await root.findByLabelText(
      /Octal/i,
    )) as HTMLInputElement;
    const hexadecimalField = (await root.findByLabelText(
      /Hexadecimal/i,
    )) as HTMLInputElement;
    const decimalField = (
      await root.findAllByLabelText(/Decimal/i)
    )[0] as HTMLInputElement;

    fireEvent.change(binaryField, { target: { value: '10100101000001' } });

    expect(binaryField.value).toEqual('10100101000001');
    expect(octalField.value).toEqual('24501');
    expect(hexadecimalField.value).toEqual('0x2941');
    expect(decimalField.value).toEqual('10561');
  });

  it('sets hexadecimals and gets a correct value in other fields', async () => {
    const root = render(<NumberBaseConversion />);
    const hexadecimalField = (await root.findByLabelText(
      /Hexadecimal/i,
    )) as HTMLInputElement;
    const binaryField = (await root.findByLabelText(
      /binary/i,
    )) as HTMLInputElement;
    const decimalField = (
      await root.findAllByLabelText(/Decimal/i)
    )[0] as HTMLInputElement;
    const octalField = (await root.findByLabelText(
      /Octal/i,
    )) as HTMLInputElement;

    fireEvent.change(hexadecimalField, {
      target: { value: '0x91923123124a3b331dddddd' },
    });

    expect(hexadecimalField.value).toEqual('0x91923123124a3b331dddddd');
    expect(octalField.value).toEqual('2214443044304445073146167356735');
    expect(decimalField.value).toEqual('2815753852291900309296242141');
    expect(binaryField.value).toEqual(
      '10010001100100100011000100100011000100100100101000111011001100110001110111011101110111011101',
    );
  });

  it('sets hexadecimal, then adds unsupported chars, thus freezes calculation results in the other fields', async () => {
    const root = render(<NumberBaseConversion />);
    const hexadecimalField = (await root.findByLabelText(
      /Hexadecimal/i,
    )) as HTMLInputElement;
    const binaryField = (await root.findByLabelText(
      /binary/i,
    )) as HTMLInputElement;
    const decimalField = (
      await root.findAllByLabelText(/Decimal/i)
    )[0] as HTMLInputElement;

    fireEvent.change(hexadecimalField, {
      target: { value: '0x91923123124a3b331dddddd' },
    });

    expect(binaryField.value).toEqual(
      '10010001100100100011000100100011000100100100101000111011001100110001110111011101110111011101',
    );
    expect(decimalField.value).toEqual('2815753852291900309296242141');

    fireEvent.change(hexadecimalField, {
      target: { value: '0x91923123124a3b331ddddddZZZZ' },
    });

    expect(hexadecimalField.value).toEqual('0x91923123124a3b331ddddddZZZZ');
    expect(binaryField.value).toEqual(
      '10010001100100100011000100100011000100100100101000111011001100110001110111011101110111011101',
    );
    expect(decimalField.value).toEqual('2815753852291900309296242141');
  });

  it('types letters and special signs to one of the fields and error gets displayed', async () => {
    const root = render(<NumberBaseConversion />);
    const octalField = (await root.findByLabelText(
      /octal/i,
    )) as HTMLInputElement;
    const decimalField = (
      await root.findAllByLabelText(/Decimal/i)
    )[0] as HTMLInputElement;
    const binaryField = (await root.findByLabelText(
      /binary/i,
    )) as HTMLInputElement;

    fireEvent.change(octalField, { target: { value: '140' } });

    let errorField = (await root.findAllByRole('alert'))[0];

    expect(errorField.innerHTML).toEqual(
      expect.stringMatching(
        /The value must be a valid, octal number, 0-prefix is required/,
      ),
    );

    fireEvent.change(decimalField, { target: { value: '@%' } });

    errorField = (await root.findAllByRole('alert'))[1];

    expect(errorField.innerHTML).toEqual(
      expect.stringMatching(
        /The value mustn't contain letters or any special signs except dot/,
      ),
    );

    fireEvent.change(binaryField, { target: { value: '123' } });

    errorField = (await root.findAllByRole('alert'))[0];

    expect(errorField.innerHTML).toEqual(
      expect.stringMatching(/The value must be a valid, binary number/),
    );
  });
});
