import { expect } from 'earljs';

import { convertUnixEpochToUtc } from '../../src/lib/convertUnixEpochToUtc';

describe(convertUnixEpochToUtc.name, () => {
  it('detects format and converts unix epoch', () => {
    expect(convertUnixEpochToUtc('1658245736')).toEqual({
      utcDate: 'Tue, 19 Jul 2022 15:48:56 GMT',
      unixTimestampFormat: 'seconds',
    });
    expect(convertUnixEpochToUtc('1658245736000')).toEqual({
      utcDate: 'Tue, 19 Jul 2022 15:48:56 GMT',
      unixTimestampFormat: 'milliseconds',
    });
    expect(convertUnixEpochToUtc('1658245736000000')).toEqual({
      utcDate: 'Tue, 19 Jul 2022 15:48:56 GMT',
      unixTimestampFormat: 'microseconds',
    });
    expect(convertUnixEpochToUtc('1658245736000000000')).toEqual({
      utcDate: 'Tue, 19 Jul 2022 15:48:56 GMT',
      unixTimestampFormat: 'nanoseconds',
    });
    expect(convertUnixEpochToUtc('1658245736000000000')).toEqual({
      utcDate: 'Tue, 19 Jul 2022 15:48:56 GMT',
      unixTimestampFormat: 'nanoseconds',
    });
  });
});
