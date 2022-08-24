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
import chainIds from 'src/misc/liamaChainSlugs';
import { safeFetch } from 'src/misc/safeFetch';
import { Chain, ChainTVL } from 'src/types/liamaChainAPI';

interface ChainFilterProps<T> {
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
      const chainSlug = chainIds[chain.chainId];
      return found && chainSlug
        ? {
            ...chain,
            chainSlug,
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
  const [filtered, setFiltered] = useState<Chain[]>([]);
  const [page, setPage] = useState({ currentPage: 1, chainsPerPage: 10 });

  const [selectedChain, setSelectedChain] = useState<Chain>();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query === '' && !selectedChain) setFiltered([]);
  }, [query, selectedChain]);

  useEffect(() => {
    const filtered =
      query.length > 0 &&
      fetchedChains
        .filter(({ name }) => {
          return name.toLowerCase().includes(query.toLowerCase());
        })
        .slice(0, 20);
    if (filtered) setFiltered(filtered);
  }, [query, fetchedChains]);

  const indexOfLastPost = page.currentPage * page.chainsPerPage;
  const indexOfFirstPost = indexOfLastPost - page.chainsPerPage;
  const currentChains = fetchedChains.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <ToolContainer>
      <Header
        icon={<StackIcon height={24} width={24} />}
        text={['Lists', 'Chain List']}
      />
      <ChainDialog
        selectedChain={selectedChain!}
        isOpenState={[isOpen, setIsOpen]}
      />
      <div className="ml-4 flex items-center justify-between gap-3">
        <Entity className="px-2" title="Search chains">
          <ChainFilter
            filtered={filtered}
            queryState={[query, setQuery]}
            selectedItemState={[selectedChain, setSelectedChain]}
            setIsOpen={setIsOpen}
          />
        </Entity>

        <Entity title="Browse pages">
          <Button
            variant="secondary"
            onClick={() => {
              setFiltered([]);
              if (page.currentPage > 1)
                setPage((page) => {
                  return {
                    ...page,
                    currentPage: page.currentPage - 1,
                  };
                });
            }}
          >
            Previous page
          </Button>

          <Button
            className="ml-2"
            variant="primary"
            onClick={() => {
              setFiltered([]);
              if (page.currentPage * page.chainsPerPage < fetchedChains.length)
                setPage((page) => {
                  return {
                    ...page,
                    currentPage: page.currentPage + 1,
                  };
                });
            }}
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

// @internal
interface PageProps {
  fetchedChains: Array<Chain & { tvl?: number }>;
}

// @internal
function ChainDialog({
  isOpenState,
  selectedChain,
}: ChainDialogProps): ReactElement {
  const [isOpen, setIsOpen] = isOpenState;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-gray-900/70" aria-hidden="true" />
      <div className="fixed inset-0 flex h-full items-center justify-center p-4">
        <div className="flex h-full w-[660px] items-center justify-center">
          <Dialog.Panel className="mx-auto w-full rounded-md bg-gray-900">
            <ChainEntity chain={selectedChain} />
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

interface ChainDialogProps {
  selectedChain: Chain;
  isOpenState: [boolean, (isOpen: boolean) => void];
}

// @internal
function ChainFilter({
  queryState,
  filtered,
  selectedItemState,
  setIsOpen,
}: ChainFilterProps<Chain>): ReactElement {
  const [selectedItem, setSelectedItem] = selectedItemState;
  const [, setQuery] = queryState;

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

          <div className="relative z-10 flex h-full flex-wrap gap-3">
            {filtered.length > 0 ? (
              filtered.map((chain) => (
                <Combobox.Option
                  className={`relative flex h-12 w-full cursor-pointer items-center rounded-md border 
                  border-gray-600 bg-gradient-to-tr from-gray-800 to-transparent shadow-md shadow-pink/5
                  hover:bg-gray-600`}
                  key={chain.chainId}
                  value={chain.name}
                >
                  {({ active }) => (
                    <h1
                      className={`pl-4 text-sm font-medium uppercase tracking-[3px] ${
                        active ? 'text-pink' : 'text-gray-200'
                      } `}
                    >
                      {chain.name}
                    </h1>
                  )}
                </Combobox.Option>
              ))
            ) : (
              <div className="mx-auto my-auto px-10 text-center">
                Looks like there are no results for this query :(
              </div>
            )}
          </div>
        </Combobox.Options>
      </div>
    </Combobox>
  );
}

export default ChainList;
