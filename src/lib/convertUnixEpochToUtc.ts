import assert from 'assert';

import { unsafeEntries } from '../../src/misc/unsafeEntries';

export function convertUnixEpochToUtc(unixEpoch: string):
  | {
      utcDate: string;
      unixTimestampFormat: UnixTimestampFormat;
    }
  | undefined {
  const unixTimestampFormat = detectUnixTimestampFormat(unixEpoch);
  assert(
    unixTimestampFormat,
    `The value ${unixEpoch} doesn't fit into any known format range`,
  );
  const utcDate = convertUnixEpochToUtcByDate(unixTimestampFormat, unixEpoch);
  if (utcDate) {
    return {
      utcDate,
      unixTimestampFormat,
    };
  }
}

export type UnixTimestampFormat =
  | 'seconds'
  | 'milliseconds'
  | 'microseconds'
  | 'nanoseconds';

// @internal
function convertUnixEpochToUtcByDate(
  unixTimestampFormat: UnixTimestampFormat,
  unixEpoch: string,
): string | undefined {
  return new Date(
    Number(unixEpoch) *
      unixTimestampFormatToEpochMultiplier[unixTimestampFormat],
  ).toUTCString();
}

// @internal
function detectUnixTimestampFormat(
  unixEpoch: string,
): UnixTimestampFormat | undefined {
  const len = unixEpoch.length;
  for (const [unixTimestampFormat, range] of unsafeEntries(
    unixTimestampFormatToLengthRange,
  )) {
    if (len <= range[1] && len >= range[0]) {
      return unixTimestampFormat;
    }
  }
}

// @internal
const unixTimestampFormatToLengthRange: Record<
  UnixTimestampFormat,
  [number, number]
> = {
  seconds: [1, 11],
  milliseconds: [12, 14],
  microseconds: [15, 16],
  nanoseconds: [17, 21],
};

// @internal
const unixTimestampFormatToEpochMultiplier = {
  milliseconds: 1,
  seconds: 1_000,
  microseconds: 1 / 1_000,
  nanoseconds: 1 / 1_000_000,
};
