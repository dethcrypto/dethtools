import { fireEvent, render } from '@testing-library/react';
import { expect } from 'earljs';

import TxDecoder from './tx-decoder.page';

describe(TxDecoder.name, () => {
  it('decodes and displays transaction correctly', async () => {
    const root = render(<TxDecoder />);

    const rawTxField = (await root.findByLabelText(
      /raw transaction/i,
    )) as HTMLInputElement;

    fireEvent.change(rawTxField, {
      target: {
        value:
          '0xf86c0a85046c7cfe0083016dea94d1310c1e038bc12865d3d3997275b3e4737c6302880b503be34d9fe80080269fc7eaaa9c21f59adf8ad43ed66cf5ef9ee1c317bd4d32cd65401e7aaca47cfaa0387d79c65b90be6260d09dcfb780f29dd8133b9b1ceb20b83b7e442b4bfc30cb',
      },
    });

    expect(rawTxField.value).toEqual(
      expect.stringMatching(
        '0xf86c0a85046c7cfe0083016dea94d1310c1e038bc12865d3d3997275b3e4737c6302880b503be34d9fe80080269fc7eaaa9c21f59adf8ad43ed66cf5ef9ee1c317bd4d32cd65401e7aaca47cfaa0387d79c65b90be6260d09dcfb780f29dd8133b9b1ceb20b83b7e442b4bfc30cb',
      ),
    );

    const decodeButton = (await root.findByText('Decode')) as HTMLButtonElement;

    fireEvent.click(decodeButton);

    expect(
      ((await root.findByText('decode results:')).nextSibling as HTMLElement)
        .innerHTML,
    ).toEqual(
      '<p>{\n  "tx": {\n    "nonce": "0xa",\n    "gasPrice": "0x46c7cfe00",\n    "gasLimit": "0x16dea",\n    "to": "0xd1310c1e038bc12865d3d3997275b3e4737c6302",\n    "value": "0xb503be34d9fe800",\n    "data": "0x",\n    "v": "0x26",\n    "r": "0xc7eaaa9c21f59adf8ad43ed66cf5ef9ee1c317bd4d32cd65401e7aaca47cfa",\n    "s": "0x387d79c65b90be6260d09dcfb780f29dd8133b9b1ceb20b83b7e442b4bfc30cb"\n  },\n  "senderAddr": "0x67835910d32600471f388a137bbff3eb07993c04"\n}</p>',
    );
  });

  it('convert raw tx input to proper format', async () => {
    const root = render(<TxDecoder />);

    const rawTxField = (await root.findByLabelText(
      /raw transaction/i,
    )) as HTMLInputElement;

    fireEvent.change(rawTxField, {
      target: {
        value: '123',
      },
    });

    expect(rawTxField.value).toEqual(expect.stringMatching('123'));

    const decodeButton = (await root.findByText('Decode')) as HTMLButtonElement;

    fireEvent.click(decodeButton);

    expect(await root.findByText(/Unable to decode transaction with 0x0123/i));
  });

  it('displays error on wrong value', async () => {
    const root = render(<TxDecoder />);

    const rawTxField = (await root.findByLabelText(
      /raw transaction/i,
    )) as HTMLInputElement;

    fireEvent.change(rawTxField, {
      target: {
        value: '0xA',
      },
    });

    expect(rawTxField.value).toEqual(expect.stringMatching('0xA'));

    const decodeButton = (await root.findByText('Decode')) as HTMLButtonElement;

    fireEvent.click(decodeButton);

    expect(await root.findByText(/Unable to decode transaction with 0x0A/i));
  });
});
