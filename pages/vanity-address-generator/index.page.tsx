import { Transition } from '@headlessui/react';
import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { ConversionInput } from 'src/components/ConversionInput';
import { Button } from 'src/components/lib/Button';
import { NodeBlock } from 'src/components/lib/NodeBlock';
import { handleChangeValidated } from 'src/misc/handleChangeValidated';
import { WithError } from 'src/misc/types';
import { hexWithoutPrefixValidator } from 'src/misc/validation/validators/hexValidator';
import { numberValidator } from 'src/misc/validation/validators/numberValidator';

import { GeneratorIcon } from '../../src/components/icons/GeneratorIcon';
import { Header } from '../../src/components/lib/Header';
import { ToolContainer } from '../../src/components/ToolContainer';
import {
  estimateTime,
  getCpuCoreCount,
  replaceZeroAddrAt,
  VanityAddressWorkerPool,
  Wallet,
  ZERO_ADDRESS_NO_PREFIX,
} from '../../src/lib/vanity-address';

export default function VanityAddressGenerator(): ReactElement {
  const [, setError] = useState('');

  const [prefix, setPrefix] = useState<WithError<string>>({ value: '' });
  const [suffix, setSuffix] = useState<WithError<string>>({ value: '' });

  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [cpuCores, setCpuCores] = useState<WithError<number>>({ value: 4 });
  const [workerPool, setWorkerPool] = useState<VanityAddressWorkerPool>();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Wallet>();

  const flushResults = (): void => {
    if (results) setResults(undefined);
  };

  const handleChangePrefix = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexWithoutPrefixValidator(newValue),
      setState: setPrefix,
      flushFn: flushResults,
    });

  const handleChangeSuffix = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexWithoutPrefixValidator(newValue),
      setState: setSuffix,
      flushFn: flushResults,
    });

  const handleChangeCpuCoreCount = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => numberValidator(newValue),
      setState: setCpuCores,
      flushFn: flushResults,
    });

  async function handleAbort(): Promise<void> {
    setIsLoading(false);
    await workerPool?.terminateWorkers();
  }

  async function handleGenerate(): Promise<void> {
    flushResults();

    const vanityAddressWorkerPool = new VanityAddressWorkerPool({
      prefix: prefix.value,
      suffix: suffix.value,
      isCaseSensitive: isCaseSensitive,
      cpuCoreCount: cpuCores.value,
    });

    setWorkerPool(vanityAddressWorkerPool);

    setIsLoading(true);

    vanityAddressWorkerPool
      .searchForMatchingWalletInParallel()
      .then((wallet) => setResults(wallet))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    void (async () => {
      if (typeof window.Worker !== 'undefined') {
        const cpuCoreCount = getCpuCoreCount();
        if (cpuCoreCount)
          setCpuCores({
            value: cpuCoreCount,
          });
      } else {
        setError('Web workers are not supported in this browser');
      }
    })();
  }, []);

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
            labelClassName="basis-3/5"
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
        <Button className="basis-3/4" onClick={handleGenerate}>
          Generate
        </Button>
        <Button variant="secondary" className="basis-1/4" onClick={handleAbort}>
          Abort
        </Button>
      </section>
      <Entity className="mt-8" title="Desired address">
        <AddressPreview prefix={prefix.value} suffix={suffix.value} />
      </Entity>
      <TimeEstimation
        prefixLength={prefix.value.length}
        suffixLength={suffix.value.length}
        isCaseSensitive={isCaseSensitive}
      />
      <GeneratorResult isLoading={isLoading} results={results} />
    </ToolContainer>
  );
}

type AddressPreviewProps = {
  prefix: string;
  suffix: string;
};

function AddressPreview({ prefix, suffix }: AddressPreviewProps): ReactElement {
  const [state, setState] = useState(ZERO_ADDRESS_NO_PREFIX);

  useEffect(
    () => replaceZeroAddrAt(prefix, suffix, state, setState),
    [prefix, state, suffix],
  );

  return <h3 className="text-xl">0x{state}</h3>;
}

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
      ) : isLoading ? (
        <>
          <LoadingBlock className="w-8/12" isLoading={true} />
          <LoadingBlock className="w-full" isLoading={true} />
        </>
      ) : (
        <>
          <LoadingBlock className="w-8/12" isLoading={false} />
          <LoadingBlock className="w-full" isLoading={false} />
        </>
      )}
    </Entity>
  );
}

function TimeEstimation({
  prefixLength,
  suffixLength,
  isCaseSensitive,
  ...props
}: TimeEstimationProps): ReactElement {
  return (
    <Entity {...props} title="Estimated time">
      <div className="flex gap-2 text-xl">
        up to{' '}
        <p className="font-bold">
          {estimateTime(prefixLength, suffixLength, isCaseSensitive)}
        </p>
      </div>
    </Entity>
  );
}

interface TimeEstimationProps extends ComponentPropsWithoutRef<'div'> {
  prefixLength: number;
  suffixLength: number;
  isCaseSensitive: boolean;
}

function LoadingBlock({
  isLoading,
  className,
}: LoadingBlockProps): ReactElement {
  return (
    <section className="flex">
      <Transition
        className={className}
        show={true}
        appear={true}
        enter="transition-opacity duration-1000"
        enterFrom="opacity-50"
        enterTo="opacity-100"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`relative isolate mt-4 h-8 w-full
          overflow-hidden rounded-md border border-gray-700 
        bg-gray-800 shadow-md shadow-gray-800
        ${
          isLoading
            ? `before:absolute before:inset-0 before:h-full before:w-full 
          before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r 
          before:from-transparent before:via-gray-700 before:to-transparent`
            : ''
        }`}
        />
      </Transition>
    </section>
  );
}

interface LoadingBlockProps extends ComponentPropsWithoutRef<'div'> {
  isLoading: boolean;
}

interface GeneratorResultProps {
  results?: Wallet;
  isLoading?: boolean;
}

function Entity({
  title,
  children,
  isLoading = false,
  className,
}: EntityProps): ReactElement {
  return (
    <div
      className={`relative isolate h-auto w-full overflow-hidden rounded-md pb-4
      ${
        isLoading
          ? `before:absolute before:inset-0 before:h-full before:w-full 
            before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r 
            before:from-transparent before:via-gray-600 before:to-transparent`
          : ''
      } ${className}`}
    >
      <p className="text-md mb-3 font-bold uppercase tracking-widest text-gray-300">
        {title}
      </p>
      {children}
    </div>
  );
}

interface EntityProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  isLoading?: boolean;
  children: ReactNode;
}
