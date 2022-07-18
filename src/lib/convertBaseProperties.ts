export const base = ['binary', 'octal', 'decimal', 'hexadecimal'] as const;

export type Base = typeof base[number];
