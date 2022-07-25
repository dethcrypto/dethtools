/** @throws {Error} Will throw error if string contains special characters */
export function stringToNumber(str: string): number {
  if (str.match(/^[.0-9]*$/)) {
    return Number.parseInt(str, 10);
  } else {
    throw new Error('String can only contain numbers');
  }
}
