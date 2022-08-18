import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import { ConversionInput } from '../../src/components/ConversionInput';
import { GeneratorIcon } from '../../src/components/icons/GeneratorIcon';
import { Button } from '../../src/components/lib/Button';
import { Entity } from '../../src/components/lib/Entity';
import { Header } from '../../src/components/lib/Header';
import { LoadingEntity } from '../../src/components/lib/LoadingEntity';
import { NodeBlock } from '../../src/components/lib/NodeBlock';
import { ToolContainer } from '../../src/components/ToolContainer';
import {
  cpu,
  formatTime,
  replaceZeroAddrAt,
  searchForMatchingWallet,
  Stats,
  VanityAddressWorkerPool,
  Wallet,
  workers,
  ZERO_ADDRESS_NO_PREFIX,
} from '../../src/lib/vanity-address';
import { handleChangeValidated } from '../../src/misc/handleChangeValidated';
import { WithError } from '../../src/misc/types';
import { hexWithoutPrefixValidator } from '../../src/misc/validation/validators/hexValidator';
import { numberValidator } from '../../src/misc/validation/validators/numberValidator';

export type WithMessage<T> = { value: T; error?: string; message?: string };

export default function VanityAddressGenerator(): ReactElement {
  const [prefix, setPrefix] = useState<WithError<string>>({ value: '' });
  const [suffix, setSuffix] = useState<WithError<string>>({ value: '' });

  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [cpuCores, setCpuCores] = useState<WithMessage<number>>({ value: 4 });
  const [workerPool, setWorkerPool] = useState<VanityAddressWorkerPool>();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Wallet>();

  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  function updateStats(stats: Stats): void {
    const { time, tries } = stats;

    const speed = Math.floor((tries * cpuCores.value) / time);

    const totalLength = prefix.value.length + suffix.value.length;
    const possibilities = Math.pow(16, totalLength);

    const secondsToFind = Math.floor(possibilities / speed);

    // reject overestimated time
    if (secondsToFind > estimatedTime && estimatedTime > 0) return;

    if (!isNaN(secondsToFind)) {
      if (isCaseSensitive)
        setEstimatedTime(secondsToFind * Math.pow(2, totalLength));
      else setEstimatedTime(secondsToFind);
    }
  }

  const flushResults = (): void => {
    if (results) setResults(undefined);
  };

  const handleChangePrefix = (newValue: string): void => {
    setEstimatedTime(0);
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexWithoutPrefixValidator(newValue),
      setState: setPrefix,
      flushFn: flushResults,
    });
  };

  const handleChangeSuffix = (newValue: string): void => {
    setEstimatedTime(0);
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexWithoutPrefixValidator(newValue),
      setState: setSuffix,
      flushFn: flushResults,
    });
  };

  const handleChangeCpuCoreCount = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => numberValidator(newValue),
      setState: setCpuCores,
      flushFn: flushResults,
    });

  async function handleAbort(): Promise<void> {
    workerPool?.terminateWorkers().finally(() => setIsLoading(false));
  }

  async function handleGenerate(): Promise<void> {
    flushResults();

    if (!cpuCores.message && !cpuCores.error) {
      const vanityAddressWorkerPool = new VanityAddressWorkerPool(
        {
          prefix: prefix.value,
          suffix: suffix.value,
          isCaseSensitive: isCaseSensitive,
          cpuCoreCount: cpuCores.value,
        },
        updateStats,
      );

      setWorkerPool(vanityAddressWorkerPool);
      setIsLoading(true);

      vanityAddressWorkerPool
        .searchForMatchingWalletInParallel()
        .then((wallet) => setResults(wallet))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(true);

      await searchForMatchingWallet(
        {
          prefix: prefix.value,
          suffix: suffix.value,
          isCaseSensitive: isCaseSensitive,
        },
        updateStats,
      )
        .then((wallet) => setResults(wallet))
        .finally(() => setIsLoading(false));
    }
  }

  useEffect(() => {
    void (async () => {
      if (workers.available()) {
        const cpuCoreCount = cpu.coreCount();
        if (cpuCoreCount)
          setCpuCores({
            value: cpuCoreCount,
          });
      } else {
        setCpuCores((cpuCores) => ({
          ...cpuCores,
          message: 'Web workers are not supported in this browser',
        }));
      }
    })();
  }, []);

  const generationIsPossible = !prefix.error && !suffix.error && !isLoading;

  const abortIsPossible = isLoading;

  return (
    <ToolContainer>
      <Header
        icon={<GeneratorIcon height={24} width={24} />}
        text={['Generators', 'Vanity Address Generator']}
      />

      <Entity title="configuration">
        <section>
          <div className="flex gap-2">
            <ConversionInput
              name="prefix"
              labelClassName="basis-1/2"
              error={prefix.error}
              onChange={({ target }) => handleChangePrefix(target.value)}
            />
            <ConversionInput
              name="suffix"
              labelClassName="basis-1/2"
              error={suffix.error}
              onChange={({ target }) => handleChangeSuffix(target.value)}
            />
          </div>
        </section>

        <section className="flex items-center justify-between">
          <ConversionInput
            type="number"
            name="cpu cores"
            value={cpuCores.value}
            error={cpuCores.error}
            message={cpuCores.message}
            disabled={!!cpuCores.message}
            labelClassName="basis-3/5"
            placeholder="4"
            onChange={({ target }) => handleChangeCpuCoreCount(target.value)}
          />
          <div className="mx-auto flex items-center gap-3">
            <span>Case sensitive</span>
            <input
              value={String(isCaseSensitive)}
              onChange={() => setIsCaseSensitive(!isCaseSensitive)}
              type="checkbox"
              className="rounded-md border-none bg-gray-900 p-3 text-gray-800
              focus:outline-none focus:ring-0 focus:ring-inset focus:ring-offset-0"
            />
          </div>
        </section>
      </Entity>

      <section className="flex gap-3">
        <Button
          disabled={!generationIsPossible}
          className="basis-3/4"
          onClick={handleGenerate}
        >
          Generate
        </Button>
        <Button
          disabled={!abortIsPossible}
          variant="secondary"
          className="basis-1/4"
          onClick={handleAbort}
        >
          Abort
        </Button>
      </section>

      <Entity className="mt-8" title="Desired address">
        <AddressPreview prefix={prefix.value} suffix={suffix.value} />
      </Entity>

      <TimeEstimation estimatedTime={estimatedTime} />
      <GeneratorResult isLoading={isLoading} results={results} />
    </ToolContainer>
  );
}

function AddressPreview({ prefix, suffix }: AddressPreviewProps): ReactElement {
  const [state, setState] = useState(ZERO_ADDRESS_NO_PREFIX);
  useEffect(
    () => setState(replaceZeroAddrAt(prefix, suffix)),
    [prefix, state, suffix],
  );
  return (
    <h3 aria-label="address preview" className="text-xl">
      0x{state}
    </h3>
  );
}

type AddressPreviewProps = {
  prefix: string;
  suffix: string;
};

function GeneratorResult({
  results,
  isLoading = false,
}: GeneratorResultProps): ReactElement {
  return (
    <Entity title="Generated wallet">
      {results ? (
        <>
          <NodeBlock className="mt-1" toggle={false} str={results.address}>
            Address:
          </NodeBlock>
          <NodeBlock className="mt-1" toggle={false} str={results.privateKey}>
            Private key:
          </NodeBlock>
        </>
      ) : (
        <div>
          <LoadingEntity className="w-8/12" isLoading={isLoading} />
          <LoadingEntity className="w-full" isLoading={isLoading} />
        </div>
      )}
    </Entity>
  );
}

function TimeEstimation({
  estimatedTime,
  ...props
}: TimeEstimationProps): ReactElement {
  return (
    <Entity {...props} title="Estimated time">
      <div className="flex gap-2 text-xl">
        up to{' '}
        <p aria-label="estimated time" className="font-bold">
          {formatTime(estimatedTime)}
        </p>
      </div>
    </Entity>
  );
}

interface TimeEstimationProps extends ComponentPropsWithoutRef<'div'> {
  estimatedTime: number;
}

interface GeneratorResultProps {
  results?: Wallet;
  isLoading?: boolean;
}
