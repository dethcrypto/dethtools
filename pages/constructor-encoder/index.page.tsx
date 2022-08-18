import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { isValidAddress, stripHexPrefix } from 'ethereumjs-util';
import { ChangeEvent, ReactElement, useState } from 'react';

import { CopyIcon } from '../../src/components/icons/CopyIcon';
import { DecodersIcon } from '../../src/components/icons/DecodersIcon';
import { OkIcon } from '../../src/components/icons/OkIcon';
import { Button } from '../../src/components/lib/Button';
import { Header } from '../../src/components/lib/Header';
import { Input } from '../../src/components/lib/Input';
import { ToolContainer } from '../../src/components/ToolContainer';
import { encodeConstructor } from '../../src/lib/encodeContructor';
import { parseAbi } from '../../src/lib/parseAbi';

export default function ConstructorEncoder(): ReactElement {
  const [error, setError] = useState<string | undefined>();
  const [encodedResult, setEncodedResult] = useState<string[] | undefined>();

  const [rawAbi, setRawAbi] = useState<string>();
  const [iface, setIface] = useState<Interface>();
  const [errors, setErrors] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);

  async function handleEncodeConstructor(): Promise<void> {
    if (!rawAbi) {
      setError('ABI is empty');
      return;
    }
    if (values.some((val) => val === '')) {
      setError('Some values are empty');
      return;
    }
    try {
      const iface = parseAbi(rawAbi) as Interface;
      try {
        const encoded = encodeConstructor(iface, values);
        setEncodedResult(stripHexPrefix(encoded).match(/.{1,64}/g) as string[]);
      } catch (e) {
        setError(`${(e as any).code} ${(e as any).argument}`);
      }
    } catch (e) {
      setError('Provided ABI is incorrect: ' + (e as Error).message);
    }
  }

  const encodeButtonDisabled =
    !!rawAbi && values.every((val) => val.length === 0);

  const handleChangeAbi = (rawAbi: string): void => {
    setError(undefined);
    setRawAbi(rawAbi);
    try {
      const parsed = parseAbi(rawAbi);
      if (parsed instanceof Interface) {
        const iface = parsed;
        setIface(iface);
        setValues(new Array(iface.deploy.inputs.length).fill(''));
        setErrors(new Array(iface.deploy.inputs.length).fill(''));
      } else {
        setError('ABI parsing failed: Unexpected end of JSON input');
      }
    } catch (_) {
      setError('Provided ABI is incorrect');
    }
  };

  const onEncodeClick = (): void =>
    void handleEncodeConstructor().catch(setError);

  const setSingleValue = (i: number, value: string): void => {
    setValues(values.map((oldValue, id) => (i === id ? value : oldValue)));
  };

  const setSingleError = (i: number, error: string): void => {
    setErrors(errors.map((oldError, id) => (i === id ? error : oldError)));
  };

  const validateInput = (i: number, value: string, type: string): void => {
    setSingleError(i, '');

    if (type.startsWith('uint')) {
      try {
        BigNumber.from(value);
      } catch (e) {
        setSingleError(i, (e as any).reason);
      }
    } else if (type === 'address') {
      if (!isValidAddress(value)) {
        setSingleError(i, 'invalid address');
      }
    } else {
      setSingleError(i, 'unsupported type');
    }
  };

  return (
    <ToolContainer>
      <Header
        icon={<DecodersIcon height={24} width={24} />}
        text={['Encoders', 'Constructor Encoder']}
      />

      <label htmlFor="abi">
        <span>ABI</span>
      </label>
      <section className="mb-3 w-full">
        <textarea
          id="abi"
          aria-label="text area for constructor abi"
          value={rawAbi || ''}
          placeholder="e.g function transferFrom(address, ..)"
          className={
            'h-20 w-full break-words rounded-md border bg-gray-900 p-4' +
            String(
              error && rawAbi?.length !== 0
                ? ' border-error/75'
                : ' border-gray-600',
            )
          }
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            handleChangeAbi(event.target.value);
          }}
        />
        {error && (
          <p aria-label="abi decode error" className="text-error">
            {error}
          </p>
        )}
      </section>

      <section>
        {iface &&
          iface.deploy.inputs.map((input, i) => (
            <section className="flex items-center gap-2" key={input.name}>
              <div className="flex flex-1 flex-col">
                <label htmlFor={`${input.name}`}>
                  <div>
                    <b className="text-purple-600">{input.type}</b>{' '}
                    <b>{input.name}</b>
                  </div>
                </label>

                <Input
                  id={`${input.name}`}
                  type="text"
                  value={values[i]}
                  error={errors[i]}
                  placeholder="e.g 0x0..."
                  className="w-full rounded-md border
                  border-gray-600 bg-gray-900 p-3.75 text-lg leading-none 
                  text-white invalid:border-error invalid:caret-error 
                  focus:border-pink focus:caret-pink focus:outline-none  disabled:text-white/50"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.value;
                    setSingleValue(i, value);
                    validateInput(i, value, input.type);
                  }}
                />
              </div>
            </section>
          ))}
      </section>

      {rawAbi?.includes('constructor') && values.length === 0 && (
        <p className="text-md pb-4 font-semibold">
          Constructor doesn't contain any arguments
        </p>
      )}

      <Button
        onClick={onEncodeClick}
        className="mt-3"
        disabled={encodeButtonDisabled}
        title={encodeButtonDisabled ? 'Calldata empty' : undefined}
      >
        Decode
      </Button>

      {!error && encodedResult?.length! > 0 && (
        <p className="text-md pb-4 pt-8 font-semibold">Encoded constructor:</p>
      )}
      {encodedResult && (
        <section
          className="relative  mb-16 rounded-md border border-gray-600 bg-gray-900 p-8"
          placeholder="Output"
        >
          <>
            {encodedResult.map((row, index) => (
              <EncodedBlock str={row} index={index} />
            ))}
          </>
        </section>
      )}
    </ToolContainer>
  );
}

function EncodedBlock({
  str,
  index,
}: {
  str: string;
  index?: number;
}): ReactElement {
  const [copyNotification, setCopyNotification] = useState(false);
  return (
    <div
      className="mb-2 flex h-10 cursor-pointer items-center gap-3 rounded-md
                  border border-gray-600 p-1 px-2 duration-200
                  hover:bg-gray-700 hover:outline active:bg-gray-800"
      onClick={(e) => {
        const value =
          e.currentTarget.children.namedItem('node-value')?.textContent;
        void window.navigator.clipboard.writeText(value ?? '');

        setCopyNotification(true);
        setTimeout(() => {
          setCopyNotification(false);
        }, 1500);
      }}
    >
      <p className="text-gray-600">{`[${index}]`}</p>
      <p aria-label="encoded-row" id="node-value">
        {str}
      </p>
      {!copyNotification ? (
        <CopyIcon className="cursor-pointer" />
      ) : (
        <OkIcon className="delay-300" />
      )}
    </div>
  );
}
