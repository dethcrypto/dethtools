import { UtcUnits } from './convertUtcProperties';

export function convertUtcToUnixEpoch(utcUnits: UtcUnits): number {
  const { sec, min, hr, day, mon, year } = utcUnits;
  return new Date(
    // Keep universal UTC format to avoid timezone issues
    Date.UTC(
      Number(year),
      Number(mon) - 1, // UTC Date indexes months 0-11
      Number(day),
      Number(hr),
      Number(min),
      Number(sec),
    ),
    // Gets the time value in milliseconds.
  ).getTime();
}
