import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { isValidAddress, stripHexPrefix } from 'ethereumjs-util';
import { ChangeEvent, useState } from 'react';

import { DecodersIcon } from '../src/components/icons/DecodersIcon';
import { Button } from '../src/components/lib/Button';
import { Input } from '../src/components/lib/Input';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import { encodeConstructor } from '../src/lib/encodeContructor';
import { parseAbi } from '../src/lib/parseAbi';

export default function ConstructorEncoder() {
  const [error, setError] = useState<string | undefined>();
  const [encodedResult, setEncodedResult] = useState<string[] | undefined>();

  const [rawAbi, setRawAbi] = useState<string>();
  const [iface, setIface] = useState<Interface>();
  const [errors, setErrors] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);

  async function handleEncodeConstructor() {
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

  const handleChangeAbi = (rawAbi: string) => {
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

  const onEncodeClick = () => void handleEncodeConstructor().catch(setError);

  const setSingleValue = (i: number, value: string) => {
    setValues(values.map((oldValue, id) => (i === id ? value : oldValue)));
  };

  const setSingleError = (i: number, error: string) => {
    setErrors(errors.map((oldError, id) => (i === id ? error : oldError)));
  };

  const validateInput = (i: number, value: string, type: string) => {
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
      <ToolHeader
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
                <label className="pb-2" htmlFor={`${input.name}`}>
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
                  className="border-deth-gray-600 bg-deth-gray-900 mb-2 mr-auto h-10 w-3/5 rounded-md border text-sm focus:outline-none"
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

      {!encodedResult && !error && rawAbi?.length === 0 && (
        <p className="text-md py-5 font-semibold">Possible decoded results:</p>
      )}
      {!encodedResult && error && (
        <p className="text-md py-5 font-semibold">
          Decoded output will appear here
        </p>
      )}
      {encodedResult && (
        <section
          className="relative mb-16 rounded-md border border-gray-600 bg-gray-900 p-8"
          placeholder="Output"
        >
          <>
            <h3 className="text-md flex-wrap pb-4 font-semibold">
              Encoded constructor:
            </h3>
            {encodedResult.map((row, i) => (
              <p aria-label="encoded-row" key={i}>
                {row}
              </p>
            ))}
          </>
        </section>
      )}
    </ToolContainer>
  );
}
