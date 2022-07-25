import { fireEvent, render } from '@testing-library/react';
import { expect } from 'earljs';
import sinon from 'sinon';

import { UnixTimestampFormat } from '../src/lib/convertUnixEpochToUtc';
import { utcUnits } from '../src/lib/convertUtcProperties';
import { currentEpochTime } from '../src/lib/currentEpochTime';
import UnixEpochUtcConversion from './unix-epoch-utc-conversion.page';

type Root = any;

function expectUtc(
  root: Root,
  unixEpoch: string,
  expectedTimestampFormat: UnixTimestampFormat,
  expectedUtcDate: string,
): void {
  const unixEpochField = root.getByLabelText('UnixEpoch') as HTMLInputElement;

  expect(unixEpochField.innerHTML).toEqual('');

  fireEvent.change(unixEpochField, {
    target: {
      value: unixEpoch,
    },
  });

  expect(unixEpochField.value).toEqual(unixEpoch);

  fireEvent.click(root.getByLabelText('convert unix epoch'));

  const assumedTimestampFormat = root.getByLabelText('assumed format');
  const utcDate = root.getByLabelText('utc date');

  expect(assumedTimestampFormat.innerHTML).toEqual(expectedTimestampFormat);
  expect(utcDate.innerHTML).toEqual(expectedUtcDate);
}

async function expectUtcError(
  root: Root,
  unixEpoch: string,
  expectedError: string,
): Promise<void> {
  const unixEpochField = root.getByLabelText('UnixEpoch') as HTMLInputElement;

  expect(unixEpochField.innerHTML).toEqual('');

  fireEvent.change(unixEpochField, {
    target: {
      value: unixEpoch,
    },
  });

  expect(unixEpochField.value).toEqual(unixEpoch);

  fireEvent.click(root.getByLabelText('convert unix epoch'));

  const error = (await root.findAllByRole('alert'))[0];

  expect(error.innerHTML).toEqual(expectedError);
}

describe(UnixEpochUtcConversion.name, () => {
  it('displays correct unix epoch time', async () => {
    const root = render(<UnixEpochUtcConversion />);
    const currentEpoch = Math.floor(new Date().getTime() / 1000);
    sinon.stub(currentEpochTime, 'get').returns(currentEpoch);
    const currentUnixEpochTime = root.getByLabelText('current unix epoch time');

    expect(currentUnixEpochTime.innerHTML).toEqual(String(currentEpoch));
  });

  it('converts unix epoch to utc, seconds assumed', () => {
    const root = render(<UnixEpochUtcConversion />);
    expectUtc(root, '1658230560', 'seconds', 'Tue, 19 Jul 2022 11:36:00 GMT');
  });

  it('converts unix epoch to utc, milliseconds assumed', () => {
    const root = render(<UnixEpochUtcConversion />);
    expectUtc(
      root,
      '165823056000',
      'milliseconds',
      'Fri, 04 Apr 1975 05:57:36 GMT',
    );
  });

  it('converts unix epoch to utc, miliseconds assumed', () => {
    const root = render(<UnixEpochUtcConversion />);
    expectUtc(
      root,
      '1658230560000000',
      'microseconds',
      'Tue, 19 Jul 2022 11:36:00 GMT',
    );
  });

  it('converts unix epoch to utc, nanoseconds assumed', () => {
    const root = render(<UnixEpochUtcConversion />);
    expectUtc(
      root,
      '1658230560000000000',
      'nanoseconds',
      'Tue, 19 Jul 2022 11:36:00 GMT',
    );
  });

  it('converts utc to unix epoch', () => {
    const root = render(<UnixEpochUtcConversion />);
    const utcTimeUnits = [...utcUnits];
    const utcTimeUnitFields: HTMLInputElement[] = [];
    for (const unit of utcTimeUnits) {
      utcTimeUnitFields.push(root.getByLabelText(unit) as HTMLInputElement);
    }
    const valuesToEnter = ['10', '20', '20', '30', '10', '2021'];
    for (const field of utcTimeUnitFields) {
      fireEvent.change(field, { target: { value: valuesToEnter.shift() } });
    }

    fireEvent.click(root.getByLabelText('convert utc'));

    const unixEpoch = root.getByLabelText('unix epoch');

    expect(unixEpoch.innerHTML).toEqual('1635625210000');
  });

  it(`displays "The value doesn't fit into any known format range" error`, async () => {
    const root = render(<UnixEpochUtcConversion />);
    const unixEpoch = '1000000100001000000000';

    await expectUtcError(
      root,
      unixEpoch,
      `The value ${unixEpoch} doesn't fit into any known format range`,
    );
  });

  it(`displays "The value mustn't contain letters or any special signs" error`, async () => {
    const root = render(<UnixEpochUtcConversion />);
    const unixEpoch = '1@';

    await expectUtcError(
      root,
      unixEpoch,
      "The value mustn't contain letters or any special signs",
    );
  });

  it(`displays utc sec regex error`, async () => {
    const root = render(<UnixEpochUtcConversion />);
    const secField = root.getByLabelText('sec') as HTMLInputElement;

    fireEvent.change(secField, { target: { value: '-1' } });

    const secError = (await root.findAllByRole('alert'))[1];

    expect(secError.innerHTML).toEqual('String can only contain numbers');
  });
});
