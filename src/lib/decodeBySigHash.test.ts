import { BigNumber } from '@ethersproject/bignumber';
import { expect } from 'earljs';
import sinon from 'sinon';

import {
  decodeByCalldata,
  decodeWithCalldata,
  decodeWithEventProps,
  fetch4BytesBy,
  parse4BytesResToIfaces,
} from './decodeBySigHash';
import { EventProps } from './decodeEvent';
import { sigHashReponseFixture } from './fixtures/sigHashResponse';

describe(parse4BytesResToIfaces.name, () => {
  it('parses fetched results to interface format', () => {
    const ifaces = parse4BytesResToIfaces(sigHashReponseFixture);
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
    const ifaces = parse4BytesResToIfaces(sigHashReponseFixture);
    const decodedResults = decodeByCalldata(
      ifaces,
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    );

    expect(decodedResults.length).toEqual(1);
    expect(decodedResults[0].decoded[0]).toEqual(
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    );
    expect(decodedResults[0].decoded[1]).toEqual(
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
    );
    expect((decodedResults[0].decoded[2] as BigNumber)._hex).toEqual(
      '0x0de0b6b3a7640000',
    );
    expect(decodedResults[0].fragment.name).toEqual('transferFrom');
    expect(decodedResults[0].sigHash).toEqual('0x23b872dd');
  });
});

describe(decodeWithCalldata.name, async () => {
  afterEach(() => {
    sinon.restore();
  });

  it('decodes calldata by 4 byte hash signature and returns matches', async () => {
    sinon
      .stub(fetch4BytesBy, 'Signatures')
      .returns(Promise.resolve(sigHashReponseFixture));
    const decodedResults = await decodeWithCalldata(
      '0x23b872dd',
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    );

    expect(decodedResults).toBeDefined();
    expect(decodedResults![0].decoded[0]).toEqual(
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    );
    expect(decodedResults![0].decoded[1]).toEqual(
      '0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C',
    );
    expect((decodedResults![0].decoded[2] as BigNumber)._hex).toEqual(
      '0x0de0b6b3a7640000',
    );
    expect(decodedResults![0].fragment.name).toEqual('transferFrom');
    expect(decodedResults![0].sigHash).toEqual('0x23b872dd');
  });

  it('decodes fragment with raw signature', async () => {
    sinon.stub(fetch4BytesBy, 'Signatures').returns(
      Promise.resolve([
        {
          id: 843153,
          created_at: '2022-07-12T07:41:16.312047Z',
          text_signature: 'buildAndPlaceBaseStation(uint256,uint32,uint32)',
          hex_signature: '0x23c32819',
          bytes_signature: '#Ã(\x19',
        },
      ]),
    );
    const decodeResult = await decodeWithCalldata('0x23c32819', '0x23c32819');

    expect(decodeResult!.length).toEqual(1);
    expect(decodeResult![0].decoded).toEqual([]);
    expect(decodeResult![0].fragment).toBeDefined();
    expect(decodeResult![0].sigHash).toEqual('0x23c32819');
  });
});

describe(decodeWithEventProps.name, async () => {
  afterEach(() => {
    sinon.restore();
  });

  it('decodes event topics by hash signature', async () => {
    const eventProps: EventProps = {
      data: '0xe2b742ea2b33efacfe4049c0d5bb074a81cd573dc2a8158b29b207225c8ef903',
      topics: [
        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
        '0x0000000000000000000000005853ed4f26a3fcea565b3fbc698bb19cdf6deb85',
        '0x000000000000000000000000e1be5d3f34e89de342ee97e6e90d405884da6c67',
      ],
    };

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

    expect(
      await decodeWithEventProps(eventProps.topics[0], eventProps).catch(),
    ).toBeDefined();
  });
});
