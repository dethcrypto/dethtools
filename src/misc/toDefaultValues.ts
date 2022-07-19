export function toDefaultValues<D>(
  literalArray: readonly string[],
  defaultValue: D,
): Record<string, D> {
  const withDefaults: Record<string, D> = {} as Record<string, D>;
  literalArray.forEach((key) => {
    withDefaults[key] = defaultValue;
  });
  return withDefaults;
}
