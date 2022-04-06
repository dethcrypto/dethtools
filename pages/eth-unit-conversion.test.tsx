import { fireEvent, render } from '@testing-library/react';
import { expect } from 'earljs';

import EthUnitConversion from './eth-unit-conversion.page';

const WEI_IN_GWEI = 1e9;
const WEI_IN_ETHER = 1e18;

describe(EthUnitConversion.name, () => {
  it('sets wei field and gets a correct value in the rest of fields', async () => {
    const root = render(<EthUnitConversion />);

    const weiField = (await root.findByLabelText(/^wei/i)) as HTMLInputElement;

    fireEvent.change(weiField, {
      target: { value: WEI_IN_ETHER.toString(10) },
    });

    expect(weiField.value).toEqual('1000000000000000000');

    const gweiField = (await root.findByLabelText(/gwei/i)) as HTMLInputElement;
    const ethField = (await root.findByLabelText(/eth/i)) as HTMLInputElement;

    expect(gweiField.value).toEqual(WEI_IN_GWEI.toString(10));
    expect(ethField.value).toEqual('1');
  });

  it('sets gwei field and gets a correct value in the rest of fields', async () => {
    const root = render(<EthUnitConversion />);

    const gweiField = (await root.findByLabelText(/gwei/i)) as HTMLInputElement;

    fireEvent.change(gweiField, { target: { value: '14000' } });

    expect(gweiField.value).toEqual('14000');

    const weiField = (await root.findByLabelText(/^wei/i)) as HTMLInputElement;
    const ethField = (await root.findByLabelText(/eth/i)) as HTMLInputElement;

    expect(weiField.value).toEqual('14000000000000');
    expect(ethField.value).toEqual('0.000014');
  });

  it('sets eth field and gets a correct value in the rest of fields', async () => {
    const root = render(<EthUnitConversion />);

    const ethField = (await root.findByLabelText(/eth/i)) as HTMLInputElement;

    fireEvent.change(ethField, { target: { value: '0.014' } });

    expect(ethField.value).toEqual('0.014');

    const gweiField = (await root.findByLabelText(/gwei/i)) as HTMLInputElement;
    const weiField = (await root.findByLabelText(/^wei/i)) as HTMLInputElement;

    expect(gweiField.value).toEqual('14000000');
    expect(weiField.value).toEqual('14000000000000000');
  });

  it('sets correct gwei input, then adds chars, thus freezes calculation results in other fields', async () => {
    const root = render(<EthUnitConversion />);
    const gweiField = (await root.findByLabelText(/gwei/i)) as HTMLInputElement;
    const weiField = (await root.findByLabelText(/^wei/i)) as HTMLInputElement;
    const ethField = (await root.findByLabelText(/eth/i)) as HTMLInputElement;

    fireEvent.change(gweiField, { target: { value: '140005.54' } });
    expect(gweiField.value).toEqual('140005.54');
    expect(weiField.value).toEqual('140005540000000');
    expect(ethField.value).toEqual('0.00014000554');

    fireEvent.change(gweiField, { target: { value: '140005.54/fa' } });
    expect(gweiField.value).toEqual('140005.54/fa');
    expect(weiField.value).toEqual('140005540000000');
    expect(ethField.value).toEqual('0.00014000554');
  });

  it('displays error message when user types a special character', async () => {
    const root = render(<EthUnitConversion />);
    const gweiField = (await root.findByLabelText(/gwei/i)) as HTMLInputElement;

    fireEvent.change(gweiField, { target: { value: '140fa,@' } });

    expect((await root.findByRole('alert')).innerHTML).toEqual(
      expect.stringMatching(
        "The value mustn't contain letters or any special signs except dot",
      ),
    );
    expect(gweiField.value).toEqual('140fa,@');

    fireEvent.change(gweiField, { target: { value: '' } });

    expect((await root.findByRole('alert')).innerHTML).toEqual(
      expect.stringMatching('The value must be longer than 1 digit'),
    );
  });

  it('types negative number and error gets displayed', async () => {
    const root = render(<EthUnitConversion />);
    const weiField = (await root.findByLabelText(/^wei/i)) as HTMLInputElement;
    const gweiField = (await root.findByLabelText(/gwei/i)) as HTMLInputElement;

    fireEvent.change(gweiField, { target: { value: '-12' } });

    expect(gweiField.value).toEqual('-12');
    expect(weiField.value).toEqual('');

    const errorField = await root.findByRole('alert');
    expect(errorField.innerHTML).toEqual(
      expect.stringMatching(
        "The value mustn't contain letters or any special signs except dot",
      ),
    );
  });
});
