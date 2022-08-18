import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'earljs';
import sinon from 'sinon';

import { cpu, workers } from '../../src/lib/vanity-address';
import { changeTargetValue } from '../../test/helpers/changeTargetValue';
import VanityAddressGenerator from './index.page';

describe(VanityAddressGenerator.name, () => {
  afterEach(() => sinon.restore());

  it('gets web workers are unavailable info ', () => {
    sinon.stub(workers, 'available').returns(false);

    const root = render(<VanityAddressGenerator />);

    expect(root.getByRole('alert').innerHTML).toEqual(
      'Web workers are not supported in this browser',
    );
  });

  it('enters wrong *-fix and gets error', () => {
    const root = render(<VanityAddressGenerator />);
    {
      const prefixField = root.getByLabelText('prefix');

      changeTargetValue(prefixField, '%');

      expect(root.getAllByRole('alert')[0].innerHTML).toEqual(
        'The value must be a hexadecimal number, 0x-prefix is added automatically',
      );
    }
    {
      const suffixField = root.getByLabelText('suffix');

      changeTargetValue(suffixField, '0x');

      expect(root.getAllByRole('alert')[0].innerHTML).toEqual(
        'The value must be a hexadecimal number, 0x-prefix is added automatically',
      );
    }
  });

  it('enters correct *-fix, so that desired address is changed', () => {
    const root = render(<VanityAddressGenerator />);
    const prefixField = root.getByLabelText('prefix');
    const suffixField = root.getByLabelText('suffix');

    changeTargetValue(prefixField, '0aA');

    expect(root.getByLabelText('address preview').innerHTML).toEqual(
      '0x0aA0000000000000000000000000000000000000',
    );

    changeTargetValue(suffixField, 'a00');

    expect(root.getByLabelText('address preview').innerHTML).toEqual(
      '0x0aA0000000000000000000000000000000000a00',
    );
  });

  it('cpu core count is set by default', () => {
    sinon.stub(workers, 'available').returns(true);
    sinon.stub(cpu, 'coreCount').returns(8);

    const root = render(<VanityAddressGenerator />);

    const cpuCoresField = root.getByLabelText('cpu cores') as HTMLInputElement;

    expect(cpuCoresField.value).toEqual('8');
  });

  it('cpu core count is set to 4 and disabled when there are no workers ', () => {
    const root = render(<VanityAddressGenerator />);

    const cpuCoresField = root.getByPlaceholderText('4') as HTMLInputElement;

    expect(cpuCoresField.value).toEqual('4');
  });

  it('changes cpu core count', () => {
    sinon.stub(workers, 'available').returns(true);
    sinon.stub(cpu, 'coreCount').returns(8);

    const root = render(<VanityAddressGenerator />);
    const cpuCoresField = root.getByLabelText('cpu cores') as HTMLInputElement;

    changeTargetValue(cpuCoresField, '4');

    expect(cpuCoresField.value).toEqual('4');
  });

  it('checks case sensitive checkbox and gets correct result', async () => {
    const root = render(<VanityAddressGenerator />);
    const prefixField = root.getByLabelText('prefix');

    changeTargetValue(prefixField, 'AA');

    const checkbox = root.getByRole('checkbox');
    const generateButton = root.getByText('Generate');

    fireEvent.click(checkbox);
    fireEvent.click(generateButton);

    const decodedValue = await root.findAllByLabelText('decoded value');

    expect(decodedValue[0].innerHTML).toBeDefined();
    expect(decodedValue[1].innerHTML).toBeDefined();
  });

  it('cant click on generate button when any of the inputs contain error', () => {
    const root = render(<VanityAddressGenerator />);

    {
      const prefixField = root.getByLabelText('prefix');

      changeTargetValue(prefixField, '%');

      const generateButton = root.getByText('Generate') as HTMLButtonElement;

      expect(generateButton.disabled).toEqual(true);
    }
    {
      const suffixField = root.getByLabelText('suffix');

      changeTargetValue(suffixField, '%');

      const generateButton = root.getByText('Generate') as HTMLButtonElement;

      expect(generateButton.disabled).toEqual(true);
    }
  });

  it("cant click on abort button when the generate button wasn't clicked", () => {
    const root = render(<VanityAddressGenerator />);
    const prefixField = root.getByLabelText('prefix');
    const abortButton = root.getByText('Abort') as HTMLButtonElement;

    changeTargetValue(prefixField, 'AAA');

    const generateButton = root.getByText('Generate');

    expect(abortButton.disabled).toEqual(true);

    generateButton.click();

    expect(abortButton.disabled).toEqual(false);
  });

  it('generates correct wallet in reasonable time', async () => {
    const root = render(<VanityAddressGenerator />);
    const prefixField = root.getByLabelText('prefix');

    changeTargetValue(prefixField, 'AAA');

    const generateButton = root.getByText('Generate');

    generateButton.click();

    const decodedValues = await waitFor(
      () => {
        return root.getAllByLabelText('decoded value');
      },
      // we estimate result to be generated under 44 seconds currently,
      // but on the average it takes around 3 seconds
      { timeout: 44_000 },
    );

    expect(decodedValues[0].innerHTML).toBeDefined();
  });

  it("cant generate in parallel if the browser doesn't support WebWorkers", () => {
    const root = render(<VanityAddressGenerator />);

    // remove worker api
    // eslint-disable-next-line no-restricted-globals
    (self.Worker as any) = undefined;

    const webWorkersError = root.getByRole('alert');

    expect(webWorkersError.innerHTML).toBeDefined();
  });

  it("generates results if the browser doesn't support WebWorkers", async () => {
    const root = render(<VanityAddressGenerator />);

    // s/a
    // eslint-disable-next-line no-restricted-globals
    (self.Worker as any) = undefined;

    const prefixField = root.getByLabelText('prefix');

    changeTargetValue(prefixField, 'a');

    const generateButton = root.getByText('Generate');

    generateButton.click();

    const decodedValue = await root.findAllByLabelText('decoded value');

    expect(decodedValue[0].innerHTML).toBeDefined();
  });
});
