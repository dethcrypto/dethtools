import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
  useEffect,
} from 'react';
import { useState } from 'react';
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
  searchForMatchingWalletInParallel,
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
  const [cpuCores, setCpuCores] = useState<WithError<number>>({ value: 4 });
  const [result, setResult] = useState<Wallet>();

  const flushResults = (): void => {};

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

  async function handleGenerate(): Promise<void> {
    const result = await searchForMatchingWalletInParallel({
      prefix: prefix.value,
      suffix: suffix.value,
      cpuCoreCount: cpuCores.value,
    });
    return setResult(result);
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

      <ConversionInput
        type="number"
        name="cpu cores"
        value={cpuCores.value}
        error={cpuCores.error}
        onChange={({ target }) => handleChangeCpuCoreCount(target.value)}
      />

      <section className="flex gap-3">
        <Button className="basis-3/4" onClick={handleGenerate}>
          Generate
        </Button>
        <Button variant="secondary" className="basis-1/4">
          Abort
        </Button>
      </section>

      {result && <GeneratorResult result={result} />}

      {/* <NotificationPanel notifications={notifications} /> */}
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

interface GeneratorResultProps {
  result: Wallet;
}

function GeneratorResult({ result }: GeneratorResultProps): ReactElement {
  return (
    <Entity className="mt-5" title="Generated wallet">
      <NodeBlock className="ml-1 mt-1" toggle={false} str={result.address}>
        Address:
      </NodeBlock>
      <NodeBlock className="ml-1" toggle={false} str={result.privateKey}>
        Private key:
      </NodeBlock>
    </Entity>
  );
}

interface EntityProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  children: ReactNode;
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

// export function NotificationPanel({
//   notifications,
// }: {
//   notifications: Notification[];
// }): ReactElement {
//   return (
//     <>
//       {notifications.map((notification) => {
//         const { type, message, when } = notification(notification.context);
//         return (
//           when && (
//             <section className="mt-10 w-full">
//               <output
//                 className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-600 bg-gray-700
//                 p-3 text-white duration-200 hover:bg-gray-600 active:scale-75 active:bg-gray-700"
//                 onClick={() => {}}
//               >
//                 <LightbulbIcon className="animate-pulse" />
//                 <p className="select-none">{text}</p>
//               </output>
//             </section>
//           )
//         );
//       })}
//     </>
//   );
// }
