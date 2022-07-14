export const NumberBase = [
  'binary',
  'octal',
  'decimal',
  'hexadecimal',
] as const;

export type NumberBaseType = typeof NumberBase[number];
