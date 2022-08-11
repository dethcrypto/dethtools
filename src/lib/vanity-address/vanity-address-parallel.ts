import {
  getCpuCoreCount,
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

    const cpuCoreCount = getCpuCoreCount();

    if (cpuCoreCount)
      for (let i = 0; i <= cpuCoreCount; i++) {
        const worker = new Worker(
          // @ts-ignore - ignore ts error because of `import.meta.url` - it's working fine
          new URL('worker.ts', import.meta.url),
          { type: 'module' },
        );
        this._workers.push(worker);
      }
  }

  public async searchForMatchingWalletInParallel(): Promise<
    Wallet | undefined
  > {
    const config = this._config;

    const searchForWallet = (worker: Worker): Promise<Wallet> =>
      new Promise((resolve) => {
        // send config to worker
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

    for (const worker of this._workers) {
      return searchForWallet(worker);
    }
  }

  public async terminateWorkers(): Promise<void> {
    this._workers.forEach((worker) => worker.postMessage('suicide'));
    this._workers.forEach((worker) => worker.terminate());
  }
}
