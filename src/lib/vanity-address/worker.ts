import {
  isVanityAddressParallelConfig,
  searchForMatchingWallet,
  VanityAddressParallelConfig,
} from './vanity-address';

onmessage = (event: MessageEvent<VanityAddressParallelConfig>) => {
  if (isVanityAddressParallelConfig(event.data)) {
    try {
      void searchForMatchingWallet(event.data).then((wallet) =>
        postMessage(wallet),
      );
    } catch (error) {
      postMessage(error);
    }
  }
};
