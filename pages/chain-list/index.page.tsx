import { Combobox, Dialog } from '@headlessui/react';
import { uniqBy } from 'lodash';
import { GetStaticProps, NextPage } from 'next';
import React, { ReactElement, useEffect, useState } from 'react';
import { ChainEntity } from 'src/components/Chain';
import { StackIcon } from 'src/components/icons/StackIcon';
import { Button } from 'src/components/lib/Button';
import { Entity } from 'src/components/lib/Entity';
import { Header } from 'src/components/lib/Header';
import { ToolContainer } from 'src/components/ToolContainer';
import { safeFetch } from 'src/misc/safeFetch';

function MyDialog({ isOpenState, selectedChain }: MyDialogProps): ReactElement {
  const [isOpen, setIsOpen] = isOpenState;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-gray-900/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="flex min-h-full w-1/2 items-center justify-center">
          <Dialog.Panel className="mx-auto w-full rounded-md bg-gray-900">
            <ChainEntity chain={selectedChain} />
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

interface MyDialogProps {
  selectedChain: Chain;
  isOpenState: [boolean, (isOpen: boolean) => void];
}

function MyCombobox({
  queryState,
  filtered,
  selectedItemState,
  setIsOpen,
}: MyComboboxProps<Chain>): ReactElement {
  const [selectedItem, setSelectedItem] = selectedItemState;
  const [query, setQuery] = queryState;

  return (
    <Combobox
      value={selectedItem}
      onChange={(item) => {
        const found = filtered.find(
          (chain) => chain.name === (item as unknown as string),
        );
        setSelectedItem(found);
        setIsOpen(true);
      }}
    >
      <div className="relative z-20">
        <Combobox.Input
          placeholder="Ethereum Mainnet"
          className="rounded-md bg-gradient-to-tr from-gray-800 to-gray-700 focus:border-pink focus:outline-none focus:ring-0"
          onChange={(event) => setQuery(event.target.value)}
          onClick={() => setSelectedItem(undefined)}
        />
        <Combobox.Options
          className="absolute mt-4 h-64 w-96 overflow-scroll 
            rounded-md border border-gray-600 bg-gray-800 p-4 shadow-md shadow-pink/5"
        >
          <div
            className={`absolute right-64 z-0 h-full w-full rounded-lg bg-pink opacity-[3%] blur-xl`}
          />

          <div className="relative z-10 flex flex-wrap gap-3">
            {filtered.map((chain) => (
              <Combobox.Option
                className={`relative flex h-12 w-full cursor-pointer items-center rounded-md border 
                  border-gray-600 bg-gradient-to-tr from-gray-800 to-transparent shadow-md shadow-pink/5
                  hover:bg-gray-600`}
                key={chain.chainId}
                value={chain.name}
              >
                {({ active, selected }) => (
                  <h1
                    className={`pl-4 text-sm font-medium uppercase tracking-[3px] ${
                      active ? 'text-pink' : 'text-gray-200'
                    } `}
                  >
                    {chain.name}
                  </h1>
                )}
              </Combobox.Option>
            ))}
          </div>
        </Combobox.Options>
      </div>
    </Combobox>
  );
}

interface MyComboboxProps<T> {
  filtered: T[];
  queryState: [string, (query: string) => void];
  selectedItemState: [T | undefined, (chain: T | undefined) => void];
  setIsOpen: (isOpen: boolean) => void;
}

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: PageProps;
}> => {
  let fetchedChains = await safeFetch<Chain[]>(
    'https://chainid.network/chains.json',
  ).then((response) => uniqBy(response, 'chain'));

  const chainTvls = await safeFetch<ChainTVL[]>('https://api.llama.fi/chains');

  fetchedChains = fetchedChains
    .map((chain) => {
      const found = chainTvls.find(
        (chainTvl) => chainTvl.chainId === chain.chainId,
      );
      return found
        ? {
            ...chain,
            tvl: found.tvl,
          }
        : chain;
    })
    .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0));

  return {
    props: {
      fetchedChains,
    },
  };
};

const ChainList: NextPage<PageProps> = ({ fetchedChains }) => {
  const [chains, setChains] = useState<Chain[]>(fetchedChains);
  const [filtered, setFiltered] = useState<Chain[]>([]);
  const [page, setPage] = useState({ currentPage: 1, chainsPerPage: 10 });

  const [selectedChain, setSelectedChain] = useState<Chain>();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const filtered =
      query === ''
        ? chains.slice(0, 20)
        : chains
            .filter(({ name }) => {
              return name.toLowerCase().includes(query.toLowerCase());
            })
            .slice(0, 20);
    setFiltered(filtered);
  }, [query, chains]);

  const indexOfLastPost = page.currentPage * page.chainsPerPage;
  const indexOfFirstPost = indexOfLastPost - page.chainsPerPage;
  const currentChains = chains.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <ToolContainer>
      <Header
        icon={<StackIcon height={24} width={24} />}
        text={['Lists', 'Chain List']}
      />
      <MyDialog
        selectedChain={selectedChain!}
        isOpenState={[isOpen, setIsOpen]}
      />
      <div className="ml-4 flex items-center justify-between gap-3">
        <Entity className="px-2" title="Search chains">
          <MyCombobox
            filtered={filtered}
            queryState={[query, setQuery]}
            selectedItemState={[selectedChain, setSelectedChain]}
            setIsOpen={setIsOpen}
          />
        </Entity>

        <Entity title="Browse pages">
          <Button
            variant="secondary"
            onClick={() =>
              setPage((page) => {
                return {
                  ...page,
                  currentPage: page.currentPage - 1,
                };
              })
            }
          >
            Previous page
          </Button>
          <Button
            className="ml-2"
            variant="primary"
            onClick={() =>
              setPage((page) => {
                return {
                  ...page,
                  currentPage: page.currentPage + 1,
                };
              })
            }
          >
            Next Page
          </Button>
        </Entity>
      </div>
      <PaginatedChains
        chains={filtered.length > 0 ? filtered : currentChains}
      />
    </ToolContainer>
  );
};

function PaginatedChains({ chains }: PaginatedChainsProps): ReactElement {
  return (
    <div className="flex-col">
      {chains.map((chain) => {
        return (
          <ChainEntity
            key={chain.chainId}
            chain={chain}
            className="m-4 w-full"
          />
        );
      })}
    </div>
  );
}

interface PaginatedChainsProps {
  chains: Chain[];
}

export interface ChainTVL {
  chainId: number;
  cmcId: string;
  gecko_id: string;
  name: string;
  tokenSymbol: string;
  tvl: number;
}

export interface Explorer {
  name: string;
  standard: string;
  url: string;
}

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Chain {
  name: string;
  shortName: string;
  chain: string;
  chainId: number;
  networkId: number;
  infoURL: string;
  nativeCurrency?: NativeCurrency;
  rpc: string[];
  slip44?: number;
  ens?: {
    // hex str
    registry: string;
  };
  explorers?: Explorer[];
  faucets?: string[];
  icon?: string;
  tvl?: number;
}

// @internal
interface PageProps {
  fetchedChains: Array<Chain & { tvl?: number }>;
}

export default ChainList;
