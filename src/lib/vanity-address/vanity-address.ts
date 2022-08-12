import { randomBytes } from 'crypto';
import {
  addHexPrefix,
  keccak,
  privateToAddress,
  stripHexPrefix,
  // @ts-ignore
  toChecksumAddress,
  zeroAddress,
} from 'ethereumjs-util';
import { privateKeyVerify, publicKeyCreate } from 'secp256k1';

import { RequireAtLeastOne } from '../../types/util.d';

export const ZERO_ADDRESS_NO_PREFIX = stripHexPrefix(zeroAddress());

const MAX_TRIES = 100_000;

type SearchForMatchingWallet<C extends VanityAddressConfig> = (
  config: C,
) => Wallet | void | undefined;

export interface Wallet {
  privateKey: string;
  publicKey: string;
  address: string;
}

export function isWallet(messageEvent: unknown): messageEvent is Wallet {
  return (
    messageEvent instanceof Object &&
    'privateKey' in messageEvent &&
    'publicKey' in messageEvent &&
    'address' in messageEvent
  );
}

export type VanityAddressConfig = RequireAtLeastOne<
  {
    prefix?: string;
    suffix?: string;
    isCaseSensitive?: boolean;
  },
  'prefix' | 'suffix'
>;

export type VanityAddressParallelConfig = VanityAddressConfig & {
  cpuCoreCount?: number;
};

export function isVanityAddressParallelConfig(
  messageEvent: unknown,
): messageEvent is VanityAddressParallelConfig {
  return messageEvent instanceof Object && 'cpuCoreCount' in messageEvent;
}

export function getPrivateKey(): Buffer {
  let privateKey;
  do {
    privateKey = randomBytes(32);
  } while (!privateKeyVerify(privateKey));
  return privateKey;
}

export function getPublicKey(privateKey: Uint8Array): Buffer {
  const publicKey = publicKeyCreate(privateKey, false).slice(1);
  const publicKeyBuf = Buffer.from(publicKey);
  return keccak(publicKeyBuf);
}

export function getAddress(publicKey: Buffer): string {
  return toChecksumAddress(
    addHexPrefix(privateToAddress(publicKey).toString('hex')),
  );
}

export const searchForMatchingWallet: SearchForMatchingWallet<
  VanityAddressConfig
> = (config) => {
  let { prefix, suffix, isCaseSensitive } = config;
  isCaseSensitive = isCaseSensitive || false;

  const pattern = `^0x${prefix || ''}.+${suffix || ''}$`;
  const flag = isCaseSensitive ? 'g' : 'gi';
  const regex = new RegExp(pattern, flag);

  let tries = 0;

  while (tries <= MAX_TRIES) {
    const privateKey = getPrivateKey();
    const publicKey = getPublicKey(privateKey);
    const address = getAddress(publicKey);

    if (regex.test(address)) {
      return {
        privateKey: privateKey.toString('hex'),
        publicKey: publicKey.toString('hex'),
        address,
      };
    } else {
      tries += 1;
    }
  }
  throw new Error('No matching wallet found');
};

export function getCpuCoreCount(): number | undefined {
  return typeof window !== 'undefined'
    ? window.navigator.hardwareConcurrency
    : undefined;
}

export function replaceZeroAddrAt(
  prefix: string,
  suffix: string,
  defaultAddress: string,
  setState: (newState: string) => void,
): void {
  const lengthToFill = defaultAddress.length - prefix.length - suffix.length;
  const zeroes = [...Array(lengthToFill).keys()].map(() => '0').join('');
  const result = prefix + zeroes + suffix;
  setState(result);
}

export function estimateTime(
  prefixLength: number,
  suffixLength: number,
  isCaseSensitive: boolean,
): string {
  const probability = (difficulty: number): number =>
    Math.floor(Math.log(0.5) / Math.log(1 - 1 / difficulty));

  const totalLength = prefixLength + suffixLength;
  const time = Math.pow(16, totalLength);

  if (isCaseSensitive)
    return formatTime(probability(time * Math.pow(2, totalLength)));
  else return formatTime(probability(time));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [
    `${h} hours `,
    m > 9
      ? `${m} minutes `
      : `${h} hours `
      ? `${m} minutes `
      : `${m} minutes ` || '0',
    s > 9 && `${s} seconds `,
  ]
    .filter(Boolean)
    .join(' ');
}
