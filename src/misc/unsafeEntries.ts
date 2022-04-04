export const unsafeEntries = Object.entries as <T>(
  obj: T,
) => [keyof T, T[keyof T]][];
