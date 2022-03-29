import { Interface } from '@ethersproject/abi';

export function parseAbi(
  rawAbi: string,
  defaultKeyword: string = 'function',
): Interface | Error {
  const formated: string[] = [];

  // check for JSON format
  try {
    return new Interface(rawAbi);
  } catch (e) {
    if (!(e instanceof Error && e.message.startsWith('Unexpected token'))) {
      return e as Error;
    }
  }

  const parsed = rawAbi
    .split("',")
    .map((line) =>
      line
        .trim()
        .split('')
        .filter((char) => char !== "'")
        .join(''),
    )
    .filter((line) => line);

  for (const frag of parsed) {
    if (!findKeyword(frag)) {
      // if the fragment contains indexed, it's a event
      if (frag.includes('indexed')) {
        formated.push(`event ${frag}`);
      } else {
        formated.push(`${defaultKeyword} ${frag}`);
      }
    } else {
      formated.push(frag);
    }
  }

  return new Interface(formated);
}

const keywords = [
  'function',
  'modifier',
  'event',
  'error',
  'constructor',
  'fallback',
  'receive',
];

// @internal
export function lastOne<T>(array: T[]): T {
  return array[array.length - 1];
}

// @internal
export function findKeyword(frag: string): boolean {
  frag = frag.trim();

  let word = '';
  const match = new RegExp(/[a-zA-Z]/);

  for (const letter of frag.split('')) {
    if (!match.test(letter)) break;
    else word += letter;
  }

  for (const keyword of keywords) {
    if (keyword === word) return true;
  }
  return false;
}
