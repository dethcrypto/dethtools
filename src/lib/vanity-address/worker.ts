import {
  isVanityAddressParallelConfig,
  searchForMatchingWallet,
  VanityAddressParallelConfig,
} from './vanity-address';

onmessage = (event: MessageEvent<VanityAddressParallelConfig>) => {
  if (isVanityAddressParallelConfig(event.data)) {
    try {
      const result = searchForMatchingWallet(event.data);
      if (result) postMessage(result);
    } catch (error) {
      postMessage(error);
    }
  }
};
