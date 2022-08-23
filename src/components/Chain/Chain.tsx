// @ts-ignore
import colorthief from 'colorthief';
import Image from 'next/image';
import Link from 'next/link';
import React, {
  ComponentPropsWithoutRef,
  Dispatch,
  FC,
  ReactElement,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

import { Chain } from '../../../pages/chain-list/index.page';
import { CoinStackIcon } from '../icons/CoinStackIcon';
import { EthereumIcon } from '../icons/EthereumIcon';
import { ExploreIcon } from '../icons/ExploreIcon';
import { LinkIcon } from '../icons/LinkIcon';
import { Table } from '../Table';

const colors = require('../../../tailwind.config').theme.colors;

const rgbToHex = (r: number, g: number, b: number): string =>
  '#' +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

const ChainDetailPanelElements = [
  'RPC',
  'Explorers',
  'Faucets',
  'URL',
] as const;

type ChainDetailPanelElement = typeof ChainDetailPanelElements[number];

export function ChainEntity({
  chain,
  className,
  ...props
}: ChainEntityProps): ReactElement {
  const [selected, setSelected] = useState<
    ChainDetailPanelElement | undefined
  >();

  const icon = useMemo(() => {
    try {
      return (
        chain.icon && `https://defillama.com/chain-icons/rsz_${chain.icon}.jpg`
      );
    } catch (error) {}
  }, [chain]);

  const [dominantColors, setDominantColors] = useState<string[]>();

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md border border-gray-600 bg-gradient-to-tr 
      from-gray-800 to-transparent shadow-md shadow-pink/5 ${className}`}
      {...props}
    >
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
            className={`mb-1 h-2 animate-gradient-x rounded-t bg-gradient-to-r from-pink to-purple`}
          />
        </>
      ) : (
        <>
          <div
            className={`absolute right-64 z-0 h-full w-full rounded-lg bg-pink opacity-[3%] blur-xl`}
          />
          <div
            className={`mb-1 h-2 animate-gradient-x rounded-t bg-gradient-to-r from-pink to-purple opacity-50`}
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
                <Image
                  id={`chain-icon-${chain.chainId}`}
                  onLoad={() => {
                    const img = document.getElementById(
                      `chain-icon-${chain.chainId}`,
                    );
                    const colorThief = new colorthief();
                    try {
                      const result = colorThief.getPalette(
                        img,
                        3,
                      ) as number[][];
                      const hexArray = result.map((rgb) =>
                        rgbToHex(rgb[0], rgb[1], rgb[2]),
                      );
                      setDominantColors(hexArray);
                    } catch (error) {}
                  }}
                  className="absolute rounded blur"
                  src={icon}
                  layout="fill"
                  objectFit="contain"
                />
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

        <ChainDetails className="w-full">
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
                show={(chain.explorers && chain.explorers.length > 0) || false}
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

          <ChainDetails.Data selected={selected}>
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
                    <Table.HeadRow>alive</Table.HeadRow>
                    <Table.HeadRow>latency</Table.HeadRow>
                    <Table.HeadRow>url</Table.HeadRow>
                  </Table.Head>
                  {chain.rpc.map((url) => {
                    return (
                      <Table.Rows>
                        <Table.Row>yes</Table.Row>
                        <Table.Row>0ms</Table.Row>
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
  );
}

interface ChainEntityProps extends ComponentPropsWithoutRef<'div'> {
  chain: Chain;
}

function ChainDetailsRoot({
  children,
  ...props
}: ChainDetailsRootProps): ReactElement {
  return (
    <div className="flex items-center justify-between" {...props}>
      <div className="flex-col items-center">{children}</div>
    </div>
  );
}

interface ChainDetailsRootProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

// this type guard is really narrowed, as ReactNode
// could be also a boolean, null etc.,
// but for this use case it does its job
function isChildReactElement(
  children: ReactElement | ReactNode,
): children is ReactElement {
  return (
    (children && typeof children === 'object' && 'type' in children) || false
  );
}

const Element: FC<ElementProps> = ({
  children,
  type = 'button',
  selectedState,
  show = true,
  name,
}): ReactElement | null => {
  const [selected, setSelected] = selectedState;

  return show ? (
    <>
      {type === 'button' ? (
        <button
          name={name}
          onClick={() => {
            if (selected === name) setSelected(undefined);
            else setSelected(name);
          }}
          className={`${
            selected === 'RPC' ? 'text-white' : 'text-gray-300'
          } text-md cursor-pointer font-semibold capitalize`}
        >
          <p>
            {isChildReactElement(children) ? (
              React.cloneElement(children, {
                fill: `${name === selected ? 'white' : colors.gray[300]}`,
              })
            ) : (
              <>{children}</>
            )}
          </p>
        </button>
      ) : (
        <a href={children as string}>
          <LinkIcon
            fill={`${selected === children ? 'white' : colors.gray[300]}`}
            className="cursor-pointer"
          />
        </a>
      )}
    </>
  ) : null;
};

interface ElementProps {
  type?: 'button' | 'link';
  show?: boolean;
  name: ChainDetailPanelElement;
  children: ReactElement | string;
  selectedState: [
    ChainDetailPanelElement | undefined,
    Dispatch<SetStateAction<ChainDetailPanelElement | undefined>>,
  ];
}

const Panel: FC = ({ children }) => {
  return <div className="flex items-center gap-3">{children}</div>;
};

const Data: FC<DataProps> = ({ children, selected }) => {
  return <>{children}</>;
};

interface DataProps {
  selected?: ChainDetailPanelElement;
}

const ChainDetails = Object.assign(ChainDetailsRoot, { Panel, Data, Element });
