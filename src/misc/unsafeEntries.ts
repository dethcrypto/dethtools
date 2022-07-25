type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Returns an array of entries with infered key-value types
 * of the given object in unsafe way.
 * @see https://github.com/microsoft/TypeScript/issues/35101
 */
export function unsafeEntries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any;
}
