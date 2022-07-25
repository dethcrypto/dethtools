import { fireEvent, render } from '@testing-library/react';
import { expect } from 'earljs';

import TokenUnitConversion from './token-unit-conversion.page';

describe(TokenUnitConversion.name, () => {
  it('sets defualt value, thus user can calculate values without getting NaN', async () => {
    const root = render(<TokenUnitConversion />);
    const decimalsField = (await root.findByLabelText(
      'Decimals',
    )) as HTMLInputElement;
    const unitField = (await root.findByLabelText(/unit/i)) as HTMLInputElement;

    fireEvent.change(unitField, { target: { value: '1' } });

    expect(decimalsField.placeholder).not.toEqual('NaN');
    expect(decimalsField.value).not.toEqual('NaN');
  });

  it('sets decimals, changes base and gets a correct value in unit field', async () => {
    const root = render(<TokenUnitConversion />);
    const decimalsField = (await root.findByLabelText(
      'Decimals',
    )) as HTMLInputElement;

    fireEvent.change(decimalsField, { target: { value: '10' } });

    expect(decimalsField.value).toEqual('10');

    const unitField = (await root.findByLabelText('Units')) as HTMLInputElement;
    const baseField = (await root.findByLabelText('Base')) as HTMLInputElement;

    fireEvent.change(baseField, { target: { value: '9' } });

    expect(unitField.value).toEqual(String(9e10));
  });

  it('sets decimals, changes unit and gets a correct value in base field', async () => {
    const root = render(<TokenUnitConversion />);
    const decimalsField = (await root.findByLabelText(
      'Decimals',
    )) as HTMLInputElement;

    fireEvent.change(decimalsField, { target: { value: '5' } });

    expect(decimalsField.value).toEqual('5');

    const unitField = (await root.findByLabelText('Units')) as HTMLInputElement;
    const baseField = (await root.findByLabelText('Base')) as HTMLInputElement;

    fireEvent.change(unitField, { target: { value: String(15e5) } });

    expect(baseField.value).toEqual('15');
  });

  it('sets correct unit input, then adds chars, thus freezes calculation results in base field', async () => {
    const root = render(<TokenUnitConversion />);
    const unitField = (await root.findByLabelText('Units')) as HTMLInputElement;
    const baseField = (await root.findByLabelText('Base')) as HTMLInputElement;

    fireEvent.change(unitField, { target: { value: '12444444000000000.55' } });

    expect(unitField.value).toEqual('12444444000000000.55');
    expect(baseField.value).toEqual('0.01244444400000000055');

    fireEvent.change(unitField, {
      target: { value: '12444444000000000.55/fa' },
    });

    expect(unitField.value).toEqual('12444444000000000.55/fa');
    expect(baseField.value).toEqual('0.01244444400000000055');
  });

  it('types letters and special signs to one of the fields and error gets displayed', async () => {
    const root = render(<TokenUnitConversion />);
    const baseField = (await root.findByLabelText('Base')) as HTMLInputElement;

    fireEvent.change(baseField, { target: { value: '140fa,@' } });

    let errorField = await root.findByRole('alert');

    expect(errorField.innerHTML).toEqual(
      expect.stringMatching(/The value mustn't contain letters/),
    );

    fireEvent.change(baseField, { target: { value: '' } });

    errorField = await root.findByRole('alert');

    expect(errorField.innerHTML).toEqual(
      expect.stringMatching(/The value must be longer than 1 digit/),
    );
  });

  it('recalculates values when decimals change', async () => {
    const root = render(<TokenUnitConversion />);
    const decimalsField = (await root.findByLabelText(
      'Decimals',
    )) as HTMLInputElement;

    fireEvent.change(decimalsField, { target: { value: '10' } });

    expect(decimalsField.value).toEqual('10');

    const unitField = (await root.findByLabelText('Units')) as HTMLInputElement;
    const baseField = (await root.findByLabelText('Base')) as HTMLInputElement;

    fireEvent.change(baseField, { target: { value: '9' } });

    expect(unitField.value).toEqual('90000000000');

    fireEvent.change(decimalsField, { target: { value: '15' } });

    expect(unitField.value).toEqual('9000000000000000');
  });

  it('types negative value to decimals, then tries to calculate values and error gets displayed', async () => {
    const root = render(<TokenUnitConversion />);
    const decimalsField = (await root.findByLabelText(
      'Decimals',
    )) as HTMLInputElement;
    const unitField = (await root.findByLabelText('Units')) as HTMLInputElement;
    const baseField = (await root.findByLabelText('Base')) as HTMLInputElement;

    fireEvent.change(decimalsField, { target: { value: '-3' } });
    fireEvent.change(unitField, { target: { value: '15' } });

    const errorField = await root.findByRole('alert');

    expect(errorField.innerHTML).toEqual(
      expect.stringMatching('The decimals must be a number greater than 0'),
    );
    expect(baseField.value).toEqual('');
  });

  it('predefined decimals set decimals correctly', async () => {
    const root = render(<TokenUnitConversion />);
    const predefinedDecimalsButton = await root.findByLabelText(
      /predefined decimals dropdown/i,
    );
    const unitField = (await root.findByLabelText(/unit/i)) as HTMLInputElement;

    fireEvent.change(unitField, { target: { value: '2013' } });

    expect(unitField.value).toEqual('2013');

    fireEvent.click(predefinedDecimalsButton);

    const rayDropdownElement = await root.findByLabelText(
      'ray predefined decimal',
    );

    fireEvent.click(rayDropdownElement);

    const baseField = (await root.findByLabelText(/base/i)) as HTMLInputElement;

    expect(baseField.value).toEqual('0.000000000000000000000002013');
  });
});
