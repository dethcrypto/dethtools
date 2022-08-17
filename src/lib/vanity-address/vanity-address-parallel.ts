import {
  cpu,
  isWallet,
  VanityAddressParallelConfig,
  Wallet,
} from './vanity-address';

export class VanityAddressWorkerPool {
  public _workers: Worker[] = [];
  private readonly _config: VanityAddressParallelConfig;

  constructor(public readonly config: VanityAddressParallelConfig) {
    this._config = config;

    if (typeof window.Worker === 'undefined')
      throw new Error('Web workers are not supported in this browser');

    const cpuCoreCount = cpu.coreCount();

    if (cpuCoreCount)
      for (let i = 0; i <= cpuCoreCount; i++) {
        const worker = new Worker(new URL('worker.ts', import.meta.url), {
          type: 'module',
        });
        this._workers.push(worker);
      }
  }

  public async searchForMatchingWalletInParallel(): Promise<
    Wallet | undefined
  > {
    const config = this._config;

    const searchForWallet = (worker: Worker): Promise<Wallet> =>
      new Promise((resolve) => {
        worker.postMessage(config);
        worker.onmessage = (
          event: MessageEvent<Wallet | VanityAddressParallelConfig>,
        ) => {
          if (isWallet(event.data)) {
            this._workers.forEach((worker) => worker.terminate());
            resolve(event.data);
          }
        };
      });

    return Promise.race(this._workers.map(searchForWallet));
  }

  public async terminateWorkers(): Promise<void> {
    this._workers.forEach((worker) => worker.terminate());
  }
}
