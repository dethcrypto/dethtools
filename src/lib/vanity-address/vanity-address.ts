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
import { currentEpochTime } from '../currentEpochTime';

export const ZERO_ADDRESS_NO_PREFIX = stripHexPrefix(zeroAddress());

const MAX_TRIES = 100_000_000;

type SearchForMatchingWallet<C extends VanityAddressConfig> = (
  config: C,
  updateStats: (stats: Stats) => void,
) => Promise<Wallet>;

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

const canUpdateStats = (tries: number): boolean => {
  if (tries >= 300) return (tries % 5_000) * Math.round(tries) === 0;
  else return true;
};

export const searchForMatchingWallet: SearchForMatchingWallet<
  VanityAddressConfig
> = async (config, updateStats) => {
  return new Promise((resolve) => {
    let { prefix, suffix, isCaseSensitive } = config;

    isCaseSensitive = isCaseSensitive || false;

    const pattern = `^0x${prefix || ''}.+${suffix || ''}$`;
    const flag = isCaseSensitive ? 'g' : 'gi';
    const regex = new RegExp(pattern, flag);

    const startTime = currentEpochTime.get();

    let tries = 0;
    let time = 0;

    while (tries <= MAX_TRIES) {
      time = currentEpochTime.get() - startTime;

      if (canUpdateStats(tries)) updateStats({ tries, time });

      const privateKey = getPrivateKey();
      const publicKey = getPublicKey(privateKey);
      const address = getAddress(publicKey);

      if (regex.test(address)) {
        return resolve({
          privateKey: privateKey.toString('hex'),
          publicKey: publicKey.toString('hex'),
          address,
        });
      } else {
        tries += 1;
      }
    }
    throw new Error('No matching wallet found');
  });
};

export const workers = {
  available: (): boolean => {
    return typeof window.Worker !== 'undefined';
  },
};

export const cpu = {
  coreCount: (): number | undefined => {
    return typeof window !== 'undefined'
      ? window.navigator.hardwareConcurrency
      : undefined;
  },
};

export function replaceZeroAddrAt(
  prefix: string,
  suffix: string,
  defaultAddress: string = ZERO_ADDRESS_NO_PREFIX,
): string {
  const lengthToFill = defaultAddress.length - prefix.length - suffix.length;
  const zeroes = [...Array(lengthToFill).keys()].map(() => '0').join('');
  return prefix + zeroes + suffix;
}

export interface Stats {
  tries: number;
  time: number;
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
