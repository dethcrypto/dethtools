/* eslint-disable no-console */
import {
  getAddress,
  getPrivateKey,
  getPublicKey,
  searchForMatchingWallet,
} from './vanity-address';

describe('vanity-address', () => {
  it(getPrivateKey.name, () => {
    const privateKey = getPrivateKey();
    console.log(privateKey.toString());
  });

  it(getPublicKey.name, () => {
    const privateKey = getPrivateKey();
    const publicKey = getPublicKey(privateKey);
    console.log(publicKey);
  });

  it(getAddress.name, () => {
    const privateKey = getPrivateKey();
    const publicKey = getPublicKey(privateKey);
    const address = getAddress(publicKey);
    console.log(address);
  });

  it(searchForMatchingWallet.name, () => {
    const config = {
      prefix: 'a',
      suffix: '',
    };
    const result = searchForMatchingWallet(config);
    console.log(result);
  });
});

export {};
