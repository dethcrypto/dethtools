import { fireEvent, render } from '@testing-library/react';
import { expect } from 'earljs';
import sinon from 'sinon';

import { fetch4BytesBy } from '../../src/lib/decodeBySigHash';
import { changeTargetValue } from '../../test/helpers/changeTargetValue';
import EventDecoder from './index.page';

describe(EventDecoder.name, () => {
  afterEach(() => {
    sinon.restore();
  });

  it('types abi, switches to ABI mode, fills three topics, presses decode button and gets correct results', async () => {
    const root = render(<EventDecoder />);

    fireEvent.click(root.getByText('ABI'));
    const abiField = (await root.findByLabelText(
      'text area for abi',
    )) as HTMLTextAreaElement;

    changeTargetValue(
      abiField,
      `
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',
      'event Transfer(address indexed, address indexed, uint256)',
      `,
    );

    expect(abiField.value).toEqual(`
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',
      'event Transfer(address indexed, address indexed, uint256)',
      `);

    const dataField = (await root.findByLabelText('data')) as HTMLInputElement;
    const topic0Field = (await root.findByLabelText(
      'topic0',
    )) as HTMLInputElement;
    const topic1Field = (await root.findByLabelText(
      'topic1',
    )) as HTMLInputElement;
    const topic2Field = (await root.findByLabelText(
      'topic2',
    )) as HTMLInputElement;

    changeTargetValue(
      topic0Field,
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    );
    changeTargetValue(
      topic1Field,
      '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
    );
    changeTargetValue(
      topic2Field,
      '0x000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c',
    );
    changeTargetValue(
      dataField,
      '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    );

    const decodeButton = (await root.findByText('Decode')) as HTMLButtonElement;

    fireEvent.click(decodeButton);

    const arg0 = await root.findByText('[0]');
    const arg1 = await root.findByText('[1]');
    const arg2 = await root.findByText('[2]');

    expect(arg0.parentElement!.innerHTML).toEqual(
      expect.stringMatching('0x8ba1f109551bD432803012645Ac136ddd64DBA72'),
    );
    expect(arg1.parentElement!.innerHTML).toEqual(
      expect.stringMatching('0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C'),
    );
    expect(arg2.parentElement!.innerHTML).toEqual(
      expect.stringMatching('1000000000000000000'),
    );
  });

  it('clicks on 4byte button, fills data and three topics and clicks on decode button', async () => {
    sinon.stub(fetch4BytesBy, 'EventSignatures').returns(
      Promise.resolve([
        {
          id: 32,
          created_at: '2020-11-30T22:38:01.206423Z',
          text_signature: 'Approval(address,address,uint256)',
          hex_signature:
            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
          bytes_signature:
            '\x8C[áåëì}[ÑOqB}\x1E\x84óÝ\x03\x14À÷²)\x1E[ \nÈÇÃ¹%',
        },
      ]),
    );

    const root = render(<EventDecoder />);

    const dataField = root.getByLabelText('data') as HTMLInputElement;
    const topic0Field = root.getByLabelText('topic0') as HTMLInputElement;
    const topic1Field = root.getByLabelText('topic1') as HTMLInputElement;
    const topic2Field = root.getByLabelText('topic2') as HTMLInputElement;

    changeTargetValue(
      topic0Field,
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    );
    changeTargetValue(
      topic1Field,
      '0x0000000000000000000000005853ed4f26a3fcea565b3fbc698bb19cdf6deb85',
    );
    changeTargetValue(
      topic2Field,
      '0x000000000000000000000000e1be5d3f34e89de342ee97e6e90d405884da6c67',
    );
    changeTargetValue(
      dataField,
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );

    const decodeButton = root.getByText('Decode') as HTMLButtonElement;

    fireEvent.click(decodeButton);

    const correctDecodedValues = [
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', // signature hash
      '0x5853eD4f26A3fceA565b3FBC698bb19cdF6DEB85',
      '0xE1Be5D3f34e89dE342Ee97E6e90D405884dA6c67',
      '0',
    ];
    const decodedValues = (await root.findAllByLabelText('decoded value')).map(
      (decoded) => decoded.innerHTML,
    );
    decodedValues.forEach((decoded, i) => {
      expect(correctDecodedValues[i]).toEqual(decoded);
    });
  });

  it('types topic in wrong format, gets error message', async () => {
    const root = render(<EventDecoder />);

    const topic0Field = (await root.findByLabelText(
      'topic0',
    )) as HTMLInputElement;

    fireEvent.change(topic0Field, {
      target: {
        value: 'ddd',
      },
    });

    expect(topic0Field.value).toEqual('ddd');

    const topic0Error = await root.findByRole('alert');

    expect(topic0Error.innerHTML).toEqual(
      expect.stringMatching(
        'The value must be a hexadecimal number, 0x-prefix is required',
      ),
    );
  });
});
