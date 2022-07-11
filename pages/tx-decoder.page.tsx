import { TypedTransaction } from '@ethereumjs/tx';
import { ChangeEvent, useState } from 'react';

import { DecodersIcon } from '../src/components/icons/DecodersIcon';
import { Button } from '../src/components/lib/Button';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import { DecodedTx, decodeTx } from '../src/lib/decodeTx';
import { toEvenHex } from '../src/lib/toEvenHex';
import { hexSchema } from '../src/misc/schemas/hexSchema';
import { WithOkAndErrorMsgOptional } from '../src/misc/types';
import { zodResultMessage } from '../src/misc/zodResultMessage';

export default function TxDecoder() {
  const [error, setError] = useState<string>();

  const [rawTx, setRawTx] = useState<WithOkAndErrorMsgOptional<string>>({
    isOk: true,
  });
  const [decodeResults, setDecodeResults] =
    useState<{ tx: TypedTransaction; senderAddr: string }>();

  function handleChangeRawTx(event: ChangeEvent<HTMLInputElement>) {
    // clear decode results and errors if something has changed
    if (!rawTx.isOk || rawTx.inner?.length! <= 0) {
      setDecodeResults(undefined);
      setError(undefined);
    }
    let { value } = event.target;
    value = toEvenHex(value);
    setRawTx((state) => {
      return { ...state, inner: value };
    });
    const parseResult = hexSchema.safeParse(value);
    if (parseResult.success) {
      setRawTx((state) => {
        return { ...state, isOk: true };
      });
    } else {
      setRawTx((state) => {
        return {
          ...state,
          isOk: false,
          errorMsg: zodResultMessage(parseResult),
        };
      });
    }
    // 0x prefixed, thus length <= 2
    if (value.length <= 2) {
      setRawTx((state) => {
        return {
          ...state,
          inner: value,
          isOk: true,
          errorMsg: undefined,
        };
      });
    }
  }

  function handleDecodeCalldata() {
    setDecodeResults(undefined);
    if (rawTx.isOk) {
      let decoded: DecodedTx | undefined;
      try {
        if (rawTx.inner) {
          decoded = decodeTx(rawTx.inner);
        }
      } catch (e) {
        setError('Unable to decode transaction');
      }
      if (decoded) setDecodeResults(decoded);
    }
  }

  const decodeButtonDisabled = !rawTx.isOk;

  return (
    <ToolContainer>
      <ToolHeader
        icon={<DecodersIcon height={24} width={24} />}
        text={['Decoders', 'Tx Decoder']}
      />
      <section>
        <label htmlFor="tx-input">raw transaction</label>
        <>
          <input
            id="tx-input"
            type="text"
            placeholder="e.g 0x0..."
            className={
              'mb-2 mt-1 mr-auto h-10 w-full rounded-md border' +
              '  bg-gray-900 text-sm focus:outline-none' +
              String(rawTx.isOk ? ' border-gray-600' : ' border-error')
            }
            onChange={(event) => handleChangeRawTx(event)}
          />
          {error && (
            <p aria-label="raw tx decode error" className="text-error">
              {error} with{' '}
              {rawTx.isOk &&
                rawTx.inner &&
                String(rawTx.inner.slice(0, 12)) + '...'}
            </p>
          )}
        </>
      </section>

      <Button
        onClick={() => handleDecodeCalldata()}
        className="mt-4"
        disabled={decodeButtonDisabled}
        title={decodeButtonDisabled ? 'Please fill in the tx field' : undefined}
      >
        Decode
      </Button>

      {(!decodeResults && !rawTx.isOk) ||
        ((rawTx as { inner?: string }).inner?.length! <= 0 && (
          <p className="text-md py-5 font-semibold">
            Possible decoded results:
          </p>
        ))}
      {!error ||
        (decodeResults && (
          <p className="text-md py-5 font-semibold">
            Decoded output will appear here
          </p>
        ))}
      {decodeResults && (
        <section
          className="relative mt-6 overflow-auto rounded-md border border-gray-600 bg-gray-900 p-8"
          placeholder="Output"
        >
          <output>
            <p>decode results:</p>
            <pre className="items-left flex flex-col text-clip text-sm">
              <p>{JSON.stringify(decodeResults, null, 2)}</p>
            </pre>
          </output>
        </section>
      )}
    </ToolContainer>
  );
}
