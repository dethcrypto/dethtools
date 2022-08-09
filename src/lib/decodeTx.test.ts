import {
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  Transaction,
} from '@ethereumjs/tx';
import { expect } from 'earljs';

import { decodeTx } from './decodeTx';

describe(decodeTx.name, () => {
  it('handles legacy tx input', () => {
    const actual = decodeTx(
      '0xf86c0a85046c7cfe0083016dea94d1310c1e038bc12865d3d3997275b3e4737c6302880b503be34d9fe80080269fc7eaaa9c21f59adf8ad43ed66cf5ef9ee1c317bd4d32cd65401e7aaca47cfaa0387d79c65b90be6260d09dcfb780f29dd8133b9b1ceb20b83b7e442b4bfc30cb',
    )!;

    expect(actual.tx).toBeA(Transaction);
    expect(actual.senderAddr).toEqual(
      '0x67835910d32600471f388a137bbff3eb07993c04',
    );
    expect(actual.tx).toMatchSnapshot();
  });

  it('handles EIP-1559 tx input', () => {
    const actual = decodeTx(
      '0x02f87301398459682f0085071c42979e82520894c9e7a3937cf24ed932b69c4545a20a5966a73fb58803311fc80a57000080c001a005a5ee2b0994acdd28f43b8fc2594cd702ada33f1f319308352e401e9b493ef9a011dd2830018dbf05a7f37860d6cff9f530b073836985005083469a86d805a7a2',
    )!;

    expect(actual.tx).toBeA(FeeMarketEIP1559Transaction);
    expect(actual.senderAddr).toEqual(
      '0xa784398ad2a43b8ba13b0eb64664778f088bf6d2',
    );
    expect(actual.tx).toMatchSnapshot();
  });

  it('handles EIP2930 transaction', () => {
    const validAddress = Buffer.from('01'.repeat(20), 'hex');
    const validSlot = Buffer.from('01'.repeat(32), 'hex');
    const chainId = 2;
    const data = Buffer.from('010200', 'hex');

    const inputTx = AccessListEIP2930Transaction.fromTxData({
      data,
      to: validAddress,
      accessList: [[validAddress, [validSlot]]],
      chainId,
    }).sign(Buffer.from('01'.repeat(32), 'hex'));

    const actual = decodeTx('0x' + inputTx.serialize().toString('hex'))!;

    expect(actual.tx).toBeA(AccessListEIP2930Transaction);

    const tx = actual.tx as AccessListEIP2930Transaction;

    expect(tx.accessList).toEqual([[validAddress, [validSlot]]]);
    expect(tx.to!.toBuffer()).toEqual(validAddress);
    expect(tx.chainId.toNumber()).toEqual(chainId);
    expect(tx.data).toEqual(data);
    expect(tx).toMatchSnapshot();
  });
});
