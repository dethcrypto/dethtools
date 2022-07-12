import { expect } from 'earljs';

import { bufferToHexString } from '../../src/lib/bufferToHexString';

describe(bufferToHexString.name, () => {
  it('convert buffer with hex notation values', () => {
    expect(bufferToHexString(Buffer.from([0x04, 0x81, 0x2d, 0x00]))).toEqual(
      '04812d00',
    );
  });
  it('convert buffer with dec notation values', () => {
    expect(
      bufferToHexString(
        Buffer.from([
          4, -127, 45, 126, 58, -104, 41, -27, -43, 27, -35, 100, -50, -77, 93,
          -16, 96, 105, -101, -63, 48, -105, 49, -67, 110, 111, 26, 84, 67, -89,
          -7, -50, 10, -12, 56, 47, -49, -42, -11, -8, -96, -117, -78, 97, -105,
          9, -62, -44, -97, -73, 113, 96, 23, 112, -14, -62, 103, -104, 90, -14,
          117, 78, 31, -116, -7,
        ]),
      ),
    ).toEqual(
      '04812d7e3a9829e5d51bdd64ceb35df060699bc1309731bd6e6f1a5443a7f9ce0af4382fcfd6f5f8a08bb2619709c2d49fb771601770f2c267985af2754e1f8cf9',
    );
  });
});
