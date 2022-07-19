import { expect } from 'earljs';

import { convertUtcToUnixEpoch } from '../../src/lib/convertUtcToUnixEpoch';

describe(convertUtcToUnixEpoch.name, () => {
  it('converts utc to unix epoch', () => {
    expect(
      convertUtcToUnixEpoch({
        sec: '1',
        min: '1',
        hr: '1',
        day: '1',
        mon: '1',
        year: '1970',
      }),
    ).toEqual(3661000);
    expect(
      convertUtcToUnixEpoch({
        sec: '15',
        min: '2',
        hr: '3',
        day: '12',
        mon: '12',
        year: '2024',
      }),
    ).toEqual(1733972535000);
    expect(
      convertUtcToUnixEpoch({
        sec: '15',
        min: '2',
        hr: '3',
        day: '12',
        mon: '12',
        year: '2400',
      }),
    ).toEqual(13599370935000);
  });
});
