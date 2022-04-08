import { BigNumber } from '@ethersproject/bignumber';
import { expect } from 'earljs';

import {
  decodeByCalldata,
  decodeWithEventProps,
  fetch4BytesData,
  fetchAndDecodeWithCalldata,
  getSignaturesByCalldata,
  parse4BytesResToIfaces,
} from './decodeBySigHash';
import { EventProps } from './decodeEvent';

describe(fetch4BytesData.name, () => {
  it('fetches data by signature', async () => {
    expect(
      await fetch4BytesData('0x23b872dd', 'signatures').catch(),
    ).toBeDefined();
  });
});

describe(getSignaturesByCalldata.name, () => {
  it('fetches correct data by signature', async () => {
    expect(await getSignaturesByCalldata('0x23b872dd')).toEqual([
      {
        id: 31781,
        created_at: '2018-05-12T20:40:45.467194Z',
        text_signature: 'gasprice_bit_ether(int128)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
      {
        id: 147,
        created_at: '2016-07-09T03:58:28.927638Z',
        text_signature: 'transferFrom(address,address,uint256)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
    ]);
  });
});

describe(parse4BytesResToIfaces.name, () => {
  it('parses fetched results to interface format', () => {
    const ifaces = parse4BytesResToIfaces([
      {
        id: 31781,
        created_at: '2018-05-12T20:40:45.467194Z',
        text_signature: 'gasprice_bit_ether(int128)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
      {
        id: 147,
        created_at: '2016-07-09T03:58:28.927638Z',
        text_signature: 'transferFrom(address,address,uint256)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
    ]);
    const gasPriceParams = ['int128'];
    const transferFromParams = ['address', 'address', 'uint256'];

    expect(ifaces.length).toEqual(2);
    expect(ifaces[0].fragments[0].name).toEqual('gasprice_bit_ether');
    expect(ifaces[1].fragments[0].name).toEqual('transferFrom');
    ifaces[0].fragments[0].inputs.forEach((param, i) => {
      expect(param.type).toEqual(gasPriceParams[i]);
    });
    ifaces[1].fragments[0].inputs.forEach((param, i) => {
      expect(param.type).toEqual(transferFromParams[i]);
    });
  });
});

describe(decodeByCalldata.name, () => {
  it('decodes interfaces', () => {
    const ifaces = parse4BytesResToIfaces([
      {
        id: 31781,
        created_at: '2018-05-12T20:40:45.467194Z',
        text_signature: 'gasprice_bit_ether(int128)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
      {
        id: 147,
        created_at: '2016-07-09T03:58:28.927638Z',
        text_signature: 'transferFrom(address,address,uint256)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
    ]);
    const decodedResults = decodeByCalldata(
      ifaces,
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    );

    expect(decodedResults.length).toEqual(1);

    expect(decodedResults[0].decoded[0] as string).toEqual(
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    );
    expect(decodedResults[0].decoded[1] as string).toEqual(
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
    );
    expect((decodedResults[0].decoded[2] as BigNumber)._hex).toEqual(
      '0x0de0b6b3a7640000',
    );
    expect(decodedResults[0].fragment.name).toEqual('transferFrom');
    expect(decodedResults[0].sigHash).toEqual('0x23b872dd');
  });
});

describe(fetchAndDecodeWithCalldata.name, async () => {
  it('decodes calldata by 4 byte hash signature and returns matches', async () => {
    const decodedResults = await fetchAndDecodeWithCalldata(
      '0x23b872dd',
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    );

    expect(decodedResults).toBeDefined();

    expect(decodedResults![0].decoded[0] as string).toEqual(
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    );
    expect(decodedResults![0].decoded[1] as string).toEqual(
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
    );
    expect((decodedResults![0].decoded[2] as BigNumber)._hex).toEqual(
      '0x0de0b6b3a7640000',
    );
    expect(decodedResults![0].fragment.name).toEqual('transferFrom');
    expect(decodedResults![0].sigHash).toEqual('0x23b872dd');
  });
});

describe(decodeWithEventProps.name, async () => {
  it('decodes event topics by hash signature', async () => {
    const eventProps: EventProps = {
      data: '0xe2b742ea2b33efacfe4049c0d5bb074a81cd573dc2a8158b29b207225c8ef903',
      topics: [
        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
        '0x0000000000000000000000005853ed4f26a3fcea565b3fbc698bb19cdf6deb85',
        '0x000000000000000000000000e1be5d3f34e89de342ee97e6e90d405884da6c67',
      ],
    };

    expect(
      await decodeWithEventProps(eventProps.topics[0], eventProps).catch(),
    ).toBeDefined();
  });
});
