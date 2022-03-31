import { expect } from 'earljs';

import { toEvenHex } from './toEvenHex';

describe(toEvenHex.name, () => {
  it('converts odd hex to even hex', () => {
    expect(toEvenHex('0x0')).toEqual('0x00');
    expect(toEvenHex('0x12')).toEqual('0x12');
    expect(toEvenHex('0x123')).toEqual('0x0123');
    expect(toEvenHex('12')).toEqual('0x12');
    expect(toEvenHex('124')).toEqual('0x0124');
  });
});
