import { Interface } from '@ethersproject/abi'

export function parseAbi(rawAbi: string): Interface | undefined {
  let formated: string[] = []

  for (let frag of rawAbi.split("',")) {
    frag = frag.replace("'", String())
    formated.push(frag)
  }
  formated = formated
    // no whitespace chars
    .map((str) => str.trim())
    // no empty
    .filter((str) => str)
    // cut if ends with ', as sometimes it happens for sm reason
    .map((str) => {
      if (str.endsWith("'")) return str.slice(0, -1)
      else return str
    })
  if (lastOne(formated).endsWith(',')) {
    lastOne(formated).slice(0, -1)
  }
  return new Interface(formated)
}

// @internal
export function lastOne<T>(array: T[]): T {
  return array[array.length - 1]
}
