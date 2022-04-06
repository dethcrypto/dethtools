export function combinations(length: number, count: number): number[][] {
  const arr = Array.from({ length }).map((_, i) => i);
  if (count > length) {
    return [];
  }
  if (count === 0) {
    return [[]];
  }
  if (count === 1) {
    return arr.map((item) => [item]);
  }

  const result: number[][] = [];

  for (let i = 0; i < arr.length - count + 1; i++) {
    const subCombinations = combinations(arr.length - i - 1, count - 1);
    for (const subCombination of subCombinations) {
      result.push([arr[i], ...subCombination.map((x) => x + i + 1)]);
    }
  }
  return result;
}
