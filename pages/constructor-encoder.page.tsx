import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { isValidAddress, stripHexPrefix } from 'ethereumjs-util';
import { ChangeEvent, useState } from 'react';

import DecoderSvg from '../public/static/svg/decoders';
import { Button } from '../src/components/lib/Button';
import { Input } from '../src/components/lib/Input';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import { encodeConstructor } from '../src/lib/encodeContructor';
import { parseAbi } from '../src/lib/parseAbi';

export interface ConstructorEncoderProps {}

export default function ConstructorEncoder() {
  const [error, setError] = useState<string | undefined>();
  const [encodedResult, setEncodedResult] = useState<string[] | undefined>();

  const [rawAbi, setRawAbi] = useState<string>();
  const [iface, setIface] = useState<Interface>();
  const [errors, setErrors] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);

  async function handleEncodeConstructor() {
    if (!rawAbi) {
      setError('Please provide ABI');
      return;
    }
    if (values.some((val) => val === '')) {
      setError('Some values are empty');
      return;
    }
    const iface = parseAbi(rawAbi) as Interface;
    try {
      const encoded = encodeConstructor(iface, values as string[]);
      setEncodedResult(stripHexPrefix(encoded).match(/.{1,64}/g) as string[]);
    } catch (e) {
      setError(`${(e as any).code} ${(e as any).argument}`);
    }
  }

  const encodeButtonDisabled = !rawAbi || values.some((val) => val === '');

  const onAbiChange = (rawAbi: string) => {
    setError(undefined);
    setRawAbi(rawAbi);
    const iface = parseAbi(rawAbi);
    if (iface instanceof Interface) {
      setIface(iface);
      setValues(new Array(iface.deploy.inputs.length).fill(''));
      setErrors(new Array(iface.deploy.inputs.length).fill(''));
    } else {
      setError(`ABI parsing failed: ${iface.message}`);
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
        icon={<DecoderSvg />}
        text={['Encoders', 'Constructor Encoder']}
      />

      <label htmlFor="abi" className="pt-2 text-lg font-bold">
        <p>ABI</p>
      </label>

      <textarea
        id="abi"
        aria-label="text area for constructor abi"
        value={rawAbi || ''}
        placeholder="e.g function transferFrom(address, ..)"
        className="flex h-48 w-full break-words rounded-b-md border-t-0
            border-deth-gray-600 bg-deth-gray-900 p-5"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          onAbiChange(event.target.value);
        }}
      />
      <section className="mb-3">
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
                  className="mb-2 mr-auto h-10 w-3/5 rounded-md border border-deth-gray-600 bg-deth-gray-900 text-sm focus:outline-none"
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

      <Button
        onClick={onEncodeClick}
        disabled={encodeButtonDisabled}
        title={encodeButtonDisabled ? 'Please fill in the calldata' : undefined}
      >
        Decode
      </Button>

      <section className="pt-4">
        {error ? (
          <p className="text-deth-error" data-testid="error">
            {error}
          </p>
        ) : encodedResult ? (
          <>
            <h3 className="text-md flex-wrap pb-4 font-semibold">
              Encoded constructor:
            </h3>
            {encodedResult.map((row, i) => (
              <p key={i} data-testid={`encodedRow_${i}`}>
                {row}
              </p>
            ))}
          </>
        ) : (
          <p> Encoded output will appear here </p>
        )}
      </section>
    </ToolContainer>
  );
}
