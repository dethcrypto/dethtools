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
  getCpuCoreCount,
  VanityAddressWorkerPool,
  Wallet,
} from '../../src/lib/vanity-address';

interface Config {
  prefix: WithError<string>;
  suffix: WithError<string>;
  cpuCores: WithError<number>;
}

type PrefixOrSuffix = keyof Omit<Config, 'cpuCores'>;

type Notification = (context: any) => {
  type: 'success' | 'error' | 'info';
  message: string;
  when: boolean;
};

export default function VanityAddressGenerator(): ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>([
    (context) => ({
      type: 'info',
      message: `We detected that your cpu has ${context.cpuCores.value} cores, although this value might be underestimated`,
      when: !!context.cpuCores,
    }),
  ]);

  const [error, setError] = useState('');

  const [prefix, setPrefix] = useState<WithError<string>>({ value: '' });
  const [suffix, setSuffix] = useState<WithError<string>>({ value: '' });

  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [cpuCores, setCpuCores] = useState<WithError<number>>({ value: 4 });
  const [workerPool, setWorkerPool] = useState<VanityAddressWorkerPool>();

  const [isLoading, setIsLoading] = useState(false);
  const [timeEstimate, setTimeEstimate] = useState<string>('0');
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
      <section className="mb-6">
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
        <Entity title="Desired address">
          <AddressPreview prefix={prefix.value} suffix={suffix.value} />
        </Entity>
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

      <section className="flex gap-3">
        <Button className="basis-3/4" onClick={handleGenerate}>
          Generate
        </Button>
        <Button variant="secondary" className="basis-1/4" onClick={handleAbort}>
          Abort
        </Button>
      </section>

      <TimeEstimation className="mt-6" />
      <GeneratorResult isLoading={isLoading} results={results} />
    </ToolContainer>
  );
}

interface AddressInputProps extends ComponentPropsWithoutRef<'input'> {}

type AddressPreviewProps = {
  prefix: string;
  suffix: string;
};

const ZERO_ADDRESS = '0000000000000000000000000000000000000000';

function AddressPreview({ prefix, suffix }: AddressPreviewProps): ReactElement {
  const [state, setState] = useState(ZERO_ADDRESS);

  useEffect(
    () => replaceZeroAddrAt(prefix, suffix, state, setState),
    [prefix, state, suffix],
  );

  return <h3 className="text-xl">0x{state}</h3>;
}

function replaceZeroAddrAt(
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

function GeneratorResult({
  results,
  isLoading = false,
}: GeneratorResultProps): ReactElement {
  return (
    <Entity className="mt-4 h-44" title="Generated wallet">
      {results ? (
        <>
          <NodeBlock className="ml-1 mt-1" toggle={false} str={results.address}>
            Address:
          </NodeBlock>
          <NodeBlock
            className="ml-1 mt-1"
            toggle={false}
            str={results.privateKey}
          >
            Private key:
          </NodeBlock>
        </>
      ) : isLoading ? (
        <>
          <LoadingBlock isLoading={true} />
          <LoadingBlock isLoading={true} />
        </>
      ) : (
        <>
          <LoadingBlock isLoading={false} />
          <LoadingBlock isLoading={false} />
        </>
      )}
    </Entity>
  );
}

function TimeEstimation({ ...props }: TimeEstimationProps): ReactElement {
  return (
    <Entity {...props} title="Estimated time">
      <div className="flex gap-2"></div>
    </Entity>
  );
}

type TimeEstimationProps = ComponentPropsWithoutRef<'div'>;

function LoadingBlock({ isLoading }: LoadingBlockProps): ReactElement {
  return (
    <section className="flex">
      <div
        className={`mt-4 h-4 w-1/6 rounded-md bg-gray-800 p-4 ${
          isLoading ? 'animate-pulse' : ''
        }`}
      />
      <div
        className={`ml-4 mt-4 h-4 w-4/6 rounded-md bg-gray-800 p-4 ${
          isLoading ? 'animate-pulse' : ''
        }`}
      />
    </section>
  );
}

interface LoadingBlockProps {
  isLoading: boolean;
}

interface GeneratorResultProps {
  results?: Wallet;
  isLoading?: boolean;
}

function Entity({ title, children, className }: EntityProps): ReactElement {
  return (
    <div
      className={`rounded-md border border-gray-600 bg-gray-700 p-3 ${className}`}
    >
      <p className="mb-0.5 font-semibold text-gray-300">{title}</p>
      {children}
    </div>
  );
}

interface EntityProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  children: ReactNode;
}
