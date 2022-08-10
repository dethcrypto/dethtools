import { randomBytes } from 'crypto';
import { keccak, privateToAddress } from 'ethereumjs-util';
import { range } from 'lodash';
import { privateKeyVerify, publicKeyCreate } from 'secp256k1';

import { RequireAtLeastOne } from '../../types/util.d';

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
  return '0x' + privateToAddress(publicKey).toString('hex');
}

export const searchForMatchingWallet: SearchForMatchingWallet<
  VanityAddressConfig
> = (config) => {
  const { prefix, suffix } = config;
  const pattern = `^0x${prefix || ''}.+${suffix || ''}$`;
  const regex = new RegExp(pattern);

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

export async function searchForMatchingWalletInParallel(
  config: VanityAddressParallelConfig,
): Promise<Wallet> {
  return new Promise((resolve) => {
    if (typeof window.Worker === 'undefined')
      throw new Error('Web workers are not supported in this browser');

    const workerList: Worker[] = [];
    const cpuCoreCount = getCpuCoreCount();

    if (cpuCoreCount)
      for (const _ of range(cpuCoreCount)) {
        const worker = new Worker(
          // @ts-ignore - ignore ts error because of `import.meta.url` - it's working fine
          new URL('worker.ts', import.meta.url),
          { type: 'module' },
        );

        // send config to worker
        worker.postMessage(config);

        worker.onmessage = (
          event: MessageEvent<Wallet | VanityAddressParallelConfig>,
        ) => {
          if (isWallet(event.data)) {
            workerList.forEach((worker) => worker.terminate());
            resolve(event.data);
          }
        };

        workerList.push(worker);
      }
  });
}
