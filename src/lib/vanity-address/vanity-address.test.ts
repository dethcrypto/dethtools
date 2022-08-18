import { expect } from 'earljs';
import { noop } from 'lodash';

import {
  formatTime,
  getAddress,
  getPrivateKey,
  getPublicKey,
  isWallet,
  replaceZeroAddrAt,
  searchForMatchingWallet,
} from './vanity-address';

describe(isWallet.name, () => {
  it('returns true for a valid wallet', () => {
    expect(isWallet({ address: '', privateKey: '', publicKey: '' })).toEqual(
      true,
    );
  });

  it('returns false for a unvalid wallet', () => {
    expect(isWallet({ address: '', privateKey: '' })).toEqual(false);
    expect(isWallet('')).toEqual(false);
  });
});

describe(replaceZeroAddrAt.name, () => {
  it('replaces unchanged chars in address with zeroes', () => {
    expect(replaceZeroAddrAt('1', '')).toEqual(
      '1000000000000000000000000000000000000000',
    );
    expect(replaceZeroAddrAt('001', '')).toEqual(
      '0010000000000000000000000000000000000000',
    );
    expect(replaceZeroAddrAt('001', '001')).toEqual(
      '0010000000000000000000000000000000000001',
    );
    expect(replaceZeroAddrAt('', '100')).toEqual(
      '0000000000000000000000000000000000000100',
    );
  });
});

describe(formatTime.name, () => {
  it('formats time', () => {
    expect(formatTime(10000)).toEqual('2 hours  46 minutes  40 seconds ');
    expect(formatTime(5000)).toEqual('1 hours  23 minutes  20 seconds ');
  });
});

describe('vanity-address', () => {
  it(getPrivateKey.name, () => {
    const privateKey = getPrivateKey();

    expect(privateKey.length).toEqual(32);
  });

  it(getPublicKey.name, () => {
    const privateKey = getPrivateKey();
    const publicKey = getPublicKey(privateKey);

    expect(publicKey.length).toEqual(32);
  });

  it(getAddress.name, () => {
    const privateKey = getPrivateKey();
    const publicKey = getPublicKey(privateKey);
    const address = getAddress(publicKey);

    expect(address.length).toEqual(42);
  });

  it(searchForMatchingWallet.name, async () => {
    const config = {
      prefix: 'a',
      suffix: '',
    };
    const result = await searchForMatchingWallet(config, noop);

    expect(isWallet(result)).toEqual(true);
  });
});
