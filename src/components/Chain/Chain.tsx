// @ts-ignore
import colorthief from 'colorthief';
import Image from 'next/image';
import Link from 'next/link';
import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Chain } from 'src/types/liamaChainAPI';

import { CoinStackIcon } from '../icons/CoinStackIcon';
import { EthereumIcon } from '../icons/EthereumIcon';
import { ExploreIcon } from '../icons/ExploreIcon';
import { Table } from '../Table';
import { ChainDetailPanelElement, ChainDetails } from './ChainDetails';

const rgbToHex = (r: number, g: number, b: number): string =>
  '#' +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

type ChainEntityColorCacheKey = `chain-icon-${number}`;

const chainEntityColorCache: Record<ChainEntityColorCacheKey, string[]> = {};

export function ChainEntity({
  chain,
  className,
  mockIcon,
  ...props
}: ChainEntityProps): ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<
    ChainDetailPanelElement | undefined
  >();

  const icon = useMemo(() => {
    try {
      return (
        chain.chainSlug &&
        `https://defillama.com/chain-icons/rsz_${chain.chainSlug}.jpg`
      );
    } catch (error) {}
  }, [chain]);

  useEffect(() => {
    if (!icon) setIsLoading(false);
  }, [icon]);

  function handleLoadImage(): void {
    const currentKey: ChainEntityColorCacheKey = `chain-icon-${chain.chainId}`;
    if (currentKey in chainEntityColorCache) {
      setIsLoading(false);
      return setDominantColors(chainEntityColorCache[currentKey]);
    }

    const img = document.getElementById(`chain-icon-${chain.chainId}`);

    const colorThief = new colorthief();
    try {
      const result = colorThief.getPalette(img, 3) as number[][];
      const hexArray = result.map((rgb) => rgbToHex(rgb[0], rgb[1], rgb[2]));

      const cacheChainId: ChainEntityColorCacheKey = `chain-icon-${chain.chainId}`;
      chainEntityColorCache[cacheChainId] = hexArray;

      setDominantColors(hexArray);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  const [dominantColors, setDominantColors] = useState<string[]>();

  return (
    <>
      <div
        className={`} relative w-full overflow-hidden rounded-md 
        border border-gray-600 bg-gradient-to-tr from-gray-800 
          to-transparent shadow-md shadow-pink/5 ${className}`}
        {...props}
      >
        {isLoading && (
          <div
            className="absolute z-30 h-full w-full bg-gray-900 opacity-100 before:absolute before:inset-0 before:h-full before:w-full 
              before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r 
              before:from-transparent before:via-gray-700 before:to-transparent"
          />
        )}
        {dominantColors ? (
          <>
            <div
              style={{ backgroundColor: dominantColors[0] }}
              className={`absolute right-64 h-full w-full rounded-lg opacity-[3%] blur-xl`}
            />
            <div
              style={{
                background: `linear-gradient(-45deg, ${dominantColors[0]}, ${dominantColors[1]}, ${dominantColors[2]})`,
              }}
              className={`mb-1 h-2 animate-gradient-x rounded-t 
            bg-gradient-to-r from-pink to-purple`}
            />
          </>
        ) : (
          <>
            <div
              className={`absolute right-64 z-0 h-full w-full rounded-lg 
            bg-pink opacity-[3%] blur-xl`}
            />
            <div
              className={`mb-1 h-2 animate-gradient-x rounded-t 
            bg-gradient-to-r from-pink to-purple opacity-50`}
            />
          </>
        )}
        <div className="relative z-10 px-4 py-4">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-5">
              {icon ? (
                <div
                  className="min-w-12 relative h-12 w-12 overflow-clip rounded-full 
                bg-gradient-to-tr from-pink to-gray-900 shadow-md shadow-gray-600"
                >
                  {mockIcon ? (
                    mockIcon
                  ) : (
                    <Image
                      id={`chain-icon-${chain.chainId}`}
                      onLoad={() => handleLoadImage()}
                      className="absolute rounded blur"
                      src={icon}
                      layout="fill"
                      objectFit="contain"
                    />
                  )}
                </div>
              ) : (
                <div
                  className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-pink 
              to-gray-900 shadow-md shadow-pink/30"
                >
                  <EthereumIcon fill="pink" className="mx-auto mt-2" />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <div className="flex gap-2 text-sm text-white">
                  <p className="uppercase">chain id: </p>
                  {chain.chainId}
                </div>

                <h1 className="text-lg font-bold uppercase leading-5 tracking-[3px] text-gray-200">
                  {chain.name}
                </h1>
                <h1 className="text-sm font-bold uppercase leading-5 tracking-[3px] text-gray-200">
                  TVL: {chain.tvl?.toString().split('.')[0]}$
                </h1>
              </div>
            </div>

            <div className="flex-col items-center gap-3 text-right">
              <span>
                {chain.nativeCurrency?.symbol}
                <sup className="ml-0.5">{chain.nativeCurrency?.decimals}</sup>
              </span>
              <p className="font-semibold tracking-[1px]">
                {chain.nativeCurrency?.name}
              </p>
            </div>
          </div>

          <ChainDetails className="h-full">
            <div className="flex w-full justify-between">
              <ChainDetails.Panel>
                <ChainDetails.Element
                  show={chain.rpc.length > 0 || false}
                  name="RPC"
                  selectedState={[selected, setSelected]}
                >
                  RPC
                </ChainDetails.Element>

                <ChainDetails.Element
                  name="URL"
                  type="link"
                  selectedState={[selected, setSelected]}
                >
                  {chain.infoURL}
                </ChainDetails.Element>

                <ChainDetails.Element
                  show={
                    (chain.explorers && chain.explorers.length > 0) || false
                  }
                  name="Explorers"
                  type="button"
                  selectedState={[selected, setSelected]}
                >
                  <ExploreIcon />
                </ChainDetails.Element>

                <ChainDetails.Element
                  show={(chain.faucets && chain.faucets.length > 0) || false}
                  name="Faucets"
                  type="button"
                  selectedState={[selected, setSelected]}
                >
                  <CoinStackIcon />
                </ChainDetails.Element>
              </ChainDetails.Panel>
              <div>
                {chain.ens ? (
                  <p className="text-md font-semibold capitalize">ENS ✔</p>
                ) : (
                  <p
                    className="text-md cursor-not-allowed font-semibold 
                capitalize opacity-5"
                  >
                    ENS
                  </p>
                )}
              </div>
            </div>

            <ChainDetails.Data>
              {chain.explorers &&
                chain.explorers.length > 0 &&
                selected === 'Explorers' && (
                  <Table>
                    <Table.Head>
                      <Table.HeadRow>name</Table.HeadRow>
                      <Table.HeadRow>standard</Table.HeadRow>
                      <Table.HeadRow>url</Table.HeadRow>
                    </Table.Head>
                    {chain.explorers.map((explorer) => {
                      return (
                        <Table.Rows>
                          <Table.Row>{explorer.name}</Table.Row>
                          <Table.Row>{explorer.standard}</Table.Row>
                          <Table.Row>
                            <Link href={explorer.url}>
                              <p className="cursor-pointer underline underline-offset-2">
                                {explorer.url}
                              </p>
                            </Link>
                          </Table.Row>
                        </Table.Rows>
                      );
                    })}
                  </Table>
                )}

              {selected === 'RPC' && chain.rpc.length > 0 && (
                <>
                  <Table>
                    <Table.Head>
                      <Table.HeadRow>id</Table.HeadRow>
                      <Table.HeadRow>url</Table.HeadRow>
                    </Table.Head>
                    {chain.rpc.map((url, id) => {
                      return (
                        <Table.Rows>
                          <Table.Row>{id + 1}</Table.Row>
                          <Table.Row>{url}</Table.Row>
                        </Table.Rows>
                      );
                    })}
                  </Table>
                </>
              )}

              {chain.faucets &&
                chain.faucets.length > 0 &&
                selected === 'Faucets' && (
                  <>
                    <Table>
                      <Table.Head>
                        <Table.HeadRow>id</Table.HeadRow>
                        <Table.HeadRow>url</Table.HeadRow>
                      </Table.Head>
                      {chain.faucets.map((faucet, index) => {
                        return (
                          <Table.Rows>
                            <Table.Row>{index}</Table.Row>
                            <Table.Row>{faucet}</Table.Row>
                          </Table.Rows>
                        );
                      })}
                    </Table>
                  </>
                )}
            </ChainDetails.Data>
          </ChainDetails>
        </div>
      </div>
    </>
  );
}

interface ChainEntityProps extends ComponentPropsWithoutRef<'div'> {
  mockIcon?: JSX.Element;
  chain: Chain;
}
