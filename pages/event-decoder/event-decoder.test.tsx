import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'earljs';
import sinon from 'sinon';

import { fetch4BytesBy } from '../../src/lib/decodeBySigHash';
import EventDecoder from './event-decoder.page';

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

    fireEvent.change(abiField, {
      target: {
        value: `
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',
      'event Transfer(address indexed, address indexed, uint256)',
      `,
      },
    });

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

    fireEvent.change(dataField, {
      target: {
        value:
          '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      },
    });
    fireEvent.change(topic0Field, {
      target: {
        value:
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      },
    });
    fireEvent.change(topic1Field, {
      target: {
        value:
          '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
      },
    });
    fireEvent.change(topic2Field, {
      target: {
        value:
          '0x000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c',
      },
    });

    expect(dataField.value).toEqual(
      '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    );
    expect(topic0Field.value).toEqual(
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    );
    expect(topic1Field.value).toEqual(
      '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
    );
    expect(topic2Field.value).toEqual(
      '0x000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c',
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

    fireEvent.change(dataField, {
      target: {
        value:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    });
    fireEvent.change(topic0Field, {
      target: {
        value:
          '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      },
    });
    fireEvent.change(topic1Field, {
      target: {
        value:
          '0x0000000000000000000000005853ed4f26a3fcea565b3fbc698bb19cdf6deb85',
      },
    });
    fireEvent.change(topic2Field, {
      target: {
        value:
          '0x000000000000000000000000e1be5d3f34e89de342ee97e6e90d405884da6c67',
      },
    });

    expect(dataField.value).toEqual(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );
    expect(topic0Field.value).toEqual(
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    );
    expect(topic1Field.value).toEqual(
      '0x0000000000000000000000005853ed4f26a3fcea565b3fbc698bb19cdf6deb85',
    );
    expect(topic2Field.value).toEqual(
      '0x000000000000000000000000e1be5d3f34e89de342ee97e6e90d405884da6c67',
    );

    const decodeButton = (await root.findByText('Decode')) as HTMLButtonElement;

    fireEvent.click(decodeButton);

    await waitFor(() =>
      expect(root.findAllByLabelText('decoded value')).toBeDefined(),
    );

    let args: HTMLElement[] = [];

    await waitFor(async () => {
      args = await root.findAllByLabelText('decoded event arg index');
    });

    const arg0 = args[0];
    const arg1 = args[1];
    const arg2 = args[2];

    expect(arg0.parentElement!.innerHTML).toEqual(
      expect.stringMatching('0x5853eD4f26A3fceA565b3FBC698bb19cdF6DEB85'),
    );
    expect(arg1.parentElement!.innerHTML).toEqual(
      expect.stringMatching('0xE1Be5D3f34e89dE342Ee97E6e90D405884dA6c67'),
    );
    expect(arg2.parentElement!.innerHTML).toEqual(expect.stringMatching('0'));
  });

  it.skip('works with non-0x prefixed values', async () => {
    const root = render(<EventDecoder />);

    fireEvent.click(root.getByText('4 bytes'));

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

    fireEvent.change(dataField, {
      target: {
        value:
          '0000000000000000000000000000000000000000000000000000000000000000',
      },
    });
    fireEvent.change(topic0Field, {
      target: {
        value:
          '8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      },
    });
    fireEvent.change(topic1Field, {
      target: {
        value:
          '0000000000000000000000005853ed4f26a3fcea565b3fbc698bb19cdf6deb85',
      },
    });
    fireEvent.change(topic2Field, {
      target: {
        value:
          '000000000000000000000000e1be5d3f34e89de342ee97e6e90d405884da6c67',
      },
    });

    const decodeButton = (await root.findByText('Decode')) as HTMLButtonElement;

    fireEvent.click(decodeButton);

    expect(
      await root.findByText(
        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
      ),
    );

    const arg0 = await waitFor(() => root.findByText('"0"'));
    const arg1 = await waitFor(() => root.findByText('"1"'));
    const arg2 = await waitFor(() => root.findByText('"2"'));

    expect(arg0.parentElement!.innerHTML).toEqual(
      expect.stringMatching(/0x5853eD4f26A3fceA565b3FBC698bb19cdF6DEB85/),
    );
    expect(arg1.parentElement!.innerHTML).toEqual(
      expect.stringMatching(/0xE1Be5D3f34e89dE342Ee97E6e90D405884dA6c67/),
    );
    expect(arg2.parentElement!.innerHTML).toEqual(expect.stringMatching(/0/));
    expect(arg0.parentElement!.innerHTML).toMatchSnapshot();
    expect(arg1.parentElement!.innerHTML).toMatchSnapshot();
    expect(arg2.parentElement!.innerHTML).toMatchSnapshot();
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
