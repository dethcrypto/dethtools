import { expect } from 'earljs';

import { combinations } from './combinations';

describe(combinations.name, () => {
  it('returns all combinations of given length', () => {
    let actual = combinations(3, 2);

    expect(actual).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);

    actual = combinations(3, 3);

    expect(actual).toEqual([[0, 1, 2]]);

    actual = combinations(3, 4);

    expect(actual).toEqual([]);

    actual = combinations(0, 0);

    expect(actual).toEqual([[]]);

    actual = combinations(3, 1);

    expect(actual).toEqual([[0], [1], [2]]);
  });

  it('returns empty array if given length is 0', () => {
    const actual = combinations(20, 0);

    expect(actual).toEqual([[]]);
  });
});
