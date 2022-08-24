import { render } from '@testing-library/react';
import { expect } from 'earljs';

import { changeTargetValue } from '../../test/helpers/changeTargetValue';
import ChainList from './index.page';

// test pagination
// test searching for chain

const mockChain = {
  name: 'Mock chain',
  chain: 'ETH',
  icon: 'ethereum',
  rpc: [
    'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
    'wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}',
    'https://api.mycryptoapi.com/eth',
    'https://cloudflare-eth.com',
  ],
  faucets: [],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  infoURL: 'https://ethereum.org',
  shortName: 'eth',
  chainId: 1,
  networkId: 1,
  slip44: 60,
  ens: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  },
  explorers: [
    {
      name: 'etherscan',
      url: 'https://etherscan.io',
      standard: 'EIP3091',
    },
  ],
  chainSlug: 'ethereum',
  tvl: 55101671827.85486,
};

const fetchedChains = [
  ...Array.from({ length: 16 }).map((_, index) => ({
    ...mockChain,
    chainId: index + 3,
  })),
  {
    name: 'Binance Smart Chain Mainnet',
    chain: 'BSC',
    rpc: [
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org',
      'https://bsc-dataseed4.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
      'wss://bsc-ws-node.nariox.org',
    ],
    faucets: ['https://free-online-app.com/faucet-for-eth-evm-chains/'],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    infoURL: 'https://www.binance.org',
    shortName: 'bnb',
    chainId: 56,
    networkId: 56,
    slip44: 714,
    explorers: [
      {
        name: 'bscscan',
        url: 'https://bscscan.com',
        standard: 'EIP3091',
      },
    ],
    chainSlug: 'binance',
    tvl: 6664169203.011698,
  },
  {
    name: 'Polygon Mainnet',
    chain: 'Polygon',
    rpc: [
      'https://polygon-rpc.com/',
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com',
    ],
    faucets: [],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    infoURL: 'https://polygon.technology/',
    shortName: 'matic',
    chainId: 137,
    networkId: 137,
    slip44: 966,
    explorers: [
      {
        name: 'polygonscan',
        url: 'https://polygonscan.com',
        standard: 'EIP3091',
      },
    ],
    chainSlug: 'polygon',
    tvl: 2313673290.8639984,
  },
];

describe(ChainList.name, () => {
  it('changes pages', () => {
    const root = render(
      <ChainList mockIcon={<></>} fetchedChains={fetchedChains} />,
    );
    {
      const chainList = root.getByLabelText('chain list');

      expect(chainList.children.length).toEqual(10);
    }
    const previousPageButton = root.getByText(
      'Previous page',
    ) as HTMLButtonElement;

    expect(previousPageButton.disabled).toEqual(true);

    const nextPageButton = root.getByText('Next Page') as HTMLButtonElement;

    nextPageButton.click();

    const chainList = root.getByLabelText('chain list');

    expect(chainList.children.length).toEqual(8);
    expect(nextPageButton.disabled).toEqual(true);
    expect(previousPageButton.disabled).toEqual(false);
  });

  it('filters chains', () => {
    const root = render(
      <ChainList mockIcon={<></>} fetchedChains={fetchedChains} />,
    );
    const filterInput = root.getByPlaceholderText('Ethereum Mainnet');

    changeTargetValue(filterInput, 'Bina');

    const filterQueryResults = root.getByLabelText(
      'chain filter query results',
    );

    expect(filterQueryResults.children.length).toEqual(1);
    expect(filterQueryResults.children[0].textContent).toEqual(
      'Binance Smart Chain Mainnet',
    );

    changeTargetValue(filterInput, '');

    // Empty filter query always results in hidden results
    expect(() => root.getByLabelText('chain filter query results')).toThrow();
  });
});
