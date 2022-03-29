import { expect } from 'earljs';

import { decodeHex } from './decodeHex';

describe('decodeHex', () => {
  it('handles edge cases', () => {
    expect(decodeHex('ab12')).toEqual('ab12');
    expect(decodeHex('wxww')).toEqual('wxww');
    expect(decodeHex('0xxx012')).toEqual('0xxx012');
    expect(decodeHex('1x1')).toEqual('1x1');
  });

  it('normalises edge case', () => {
    expect(decodeHex('0X13')).toEqual('19');
  });

  it('handles trivial cases', () => {
    expect(decodeHex('0x0')).toEqual('0');
    expect(decodeHex('0x0000000000000000000000')).toEqual('0');

    expect(decodeHex('0x0000001')).toEqual('1');
    expect(decodeHex('0x00000010000001')).toEqual('268435457');

    expect(decodeHex('0xabcab12')).toEqual('180136722');
    expect(decodeHex('0xabcabcdef')).toEqual('46115048943');

    expect(decodeHex('0x000000000ab12')).toEqual('43794');
    expect(decodeHex('0xafafafafafafafa000000fafafa')).toEqual(
      '222708811334214420065425739676410',
    );

    expect(decodeHex('0x059445e1317134A3F20D95A06Df5A36443a833f5')).toEqual(
      '31851551520483547527162890012382687127533007861',
    );
    expect(
      decodeHex(
        '0x43ff17839cf09ffe577742a85b07fa375db13e2f1f6f21b0c960fee34cc58c60',
      ),
    ).toEqual(
      '30755669145044030478169111819325169848054427255194783789012398660124215184480',
    );
  });

  it('handles long cases', () => {
    expect(decodeHex('0x059445e1317134A3F20D95A06Df5A36443a833f5')).toEqual(
      '31851551520483547527162890012382687127533007861',
    );
    expect(
      decodeHex(
        '0x43ff17839cf09ffe577742a85b07fa375db13e2f1f6f21b0c960fee34cc58c60',
      ),
    ).toEqual(
      '30755669145044030478169111819325169848054427255194783789012398660124215184480',
    );
  });
});
