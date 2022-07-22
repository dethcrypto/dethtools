import { expect } from 'earljs';

import { utcUnits } from '../lib/convertUtcProperties';
import { toDefaultValues } from './toDefaultValues';

describe(toDefaultValues.name, () => {
  it('should return an object with the primitive default values', () => {
    expect(toDefaultValues(['a', 'b', 'c'], 'd')).toEqual({
      a: 'd',
      b: 'd',
      c: 'd',
    });
    expect(toDefaultValues(['a', 'b', 'd'], '')).toEqual({
      a: '',
      b: '',
      d: '',
    });
    expect(toDefaultValues(utcUnits, '')).toEqual({
      hr: '',
      day: '',
      min: '',
      mon: '',
      sec: '',
      year: '',
    });
  });

  it('should return an object with the non-primitive default values', () => {
    expect(toDefaultValues(['a', 'b', 'c'], { value: '' })).toEqual({
      a: { value: '' },
      b: { value: '' },
      c: { value: '' },
    });
  });
});
