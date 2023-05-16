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
  chainSlug?: string;
  explorers?: Explorer[];
  faucets?: string[];
  icon?: string;
  tvl?: number;
}
