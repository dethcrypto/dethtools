import { expect } from 'earljs';

import { getContractAddress } from './contractAddress';

describe(getContractAddress.name, () => {
  it('calculates a contract address based on a from address and a nonce', () => {
    expect(
      getContractAddress({
        from: '0x9C33eaCc2F50E39940D3AfaF2c7B8246B681A374',
        nonce: '0',
      }),
    ).toEqual('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
  });
});
