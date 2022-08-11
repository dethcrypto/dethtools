import {
  isVanityAddressParallelConfig,
  searchForMatchingWallet,
  VanityAddressParallelConfig,
} from './vanity-address';

onmessage = (event: MessageEvent<VanityAddressParallelConfig | string>) => {
  if (event.data === 'suicide') {
    // eslint-disable-next-line no-restricted-globals
    self.close();
  }
  if (isVanityAddressParallelConfig(event.data)) {
    try {
      const result = searchForMatchingWallet(event.data);
      if (result) postMessage(result);
    } catch (error) {
      postMessage(error);
    }
  }
};
