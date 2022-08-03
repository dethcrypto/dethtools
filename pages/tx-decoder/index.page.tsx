import { TypedTransaction } from '@ethereumjs/tx';
import { Disclosure } from '@headlessui/react';
import { addHexPrefix } from 'ethereumjs-util';
import { ChangeEvent, ReactElement, useState } from 'react';

import { ConversionInput } from '../../src/components/ConversionInput';
import { DecodersIcon } from '../../src/components/icons/DecodersIcon';
import { Button } from '../../src/components/lib/Button';
import { DisclosureArrow } from '../../src/components/lib/DisclosureArrow';
import { NodeBlock } from '../../src/components/NodeBlock';
import { ToolContainer } from '../../src/components/ToolContainer';
import { ToolHeader } from '../../src/components/ToolHeader';
import { bufferToHexString } from '../../src/lib/bufferToHexString';
import { DecodedTx, decodeTx } from '../../src/lib/decodeTx';
import { toEvenHex } from '../../src/lib/toEvenHex';
import { hexSchema } from '../../src/misc/validation/schemas/hexSchema';
import { WithOkAndErrorMsgOptional } from '../../src/misc/types';
import { zodResultMessage } from '../../src/misc/zodResultMessage';

export default function TxDecoder(): ReactElement {
  const [error, setError] = useState<string>();

  const [rawTx, setRawTx] = useState<WithOkAndErrorMsgOptional<string>>({
    isOk: true,
  });
  const [decodeResults, setDecodeResults] = useState<{
    tx: TypedTransaction;
    senderAddr: string;
  }>();

  function handleChangeRawTx(event: ChangeEvent<HTMLInputElement>): void {
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

  function handleDecodeCalldata(): void {
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
        <>
          <ConversionInput
            name="raw transaction"
            id="tx-input"
            type="text"
            placeholder="0x0.."
            className={rawTx.isOk ? 'border-gray-600' : 'bg-gray-900'}
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
          <NodeBlock className="my-1" str={decodeResults.senderAddr}>
            <p aria-label="decoded event arg index" className="text-gray-100">
              senderAddress
            </p>
          </NodeBlock>
          {<TxDecoderResults decodeResults={decodeResults.tx} />}
        </section>
      )}
    </ToolContainer>
  );
}

function isElementEmpty(
  element: { [key: string]: unknown } | undefined,
): boolean {
  if (!element) {
    return false;
  } else {
    return !Object.values(element).some((value) => value);
  }
}

function TxDecoderResults({
  decodeResults,
}: {
  decodeResults: TypedTransaction;
}): ReactElement {
  return (
    <>
      <div
        aria-label="tx decoder results"
        className="border-l border-gray-600 p-4"
      >
        {Object.entries(decodeResults).map(([key, value], i) => {
          if (key === 'buf') {
            return (
              <NodeBlock
                className="my-1"
                str={addHexPrefix(bufferToHexString(value))}
                key={i}
              >
                <p
                  aria-label="decoded event arg index"
                  className="text-gray-300"
                >{`${key}`}</p>
              </NodeBlock>
            );
          }
          return typeof value === 'string' || typeof value === 'number' ? (
            <NodeBlock className="my-1" str={value.toString()} key={i}>
              <p
                aria-label="decoded event arg index"
                className="text-gray-300"
              >{`${key}`}</p>
            </NodeBlock>
          ) : (
            <>
              {!isElementEmpty(value) && (
                <Disclosure key={i} defaultOpen={true}>
                  {({ open }) => (
                    <>
                      {value && <p className="text-gray-300">{key}</p>}
                      <Disclosure.Button>
                        {!isElementEmpty(value) && (
                          <DisclosureArrow open={open} />
                        )}
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        {value && <TxDecoderResults decodeResults={value} />}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )}
            </>
          );
        })}
      </div>
    </>
  );
}
