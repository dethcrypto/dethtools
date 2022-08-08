import { TypedTransaction } from '@ethereumjs/tx';
import { Disclosure } from '@headlessui/react';
import { addHexPrefix } from 'ethereumjs-util';
import { ReactElement, useState } from 'react';

import { ConversionInput } from '../../src/components/ConversionInput';
import { DecodersIcon } from '../../src/components/icons/DecodersIcon';
import { Button } from '../../src/components/lib/Button';
import { DisclosureArrow } from '../../src/components/lib/DisclosureArrow';
import { Toggle } from '../../src/components/lib/Toggle';
import { NodeBlock } from '../../src/components/NodeBlock';
import { ToolContainer } from '../../src/components/ToolContainer';
import { ToolHeader } from '../../src/components/ToolHeader';
import { bufferToHexString } from '../../src/lib/bufferToHexString';
import { decodeTx } from '../../src/lib/decodeTx';
import { handleChangeValidated } from '../../src/misc/handleChangeValidated';
import { WithError } from '../../src/misc/types';
import { hexValidator } from '../../src/misc/validation/validators/hexValidator';

export default function TxDecoder(): ReactElement {
  const [tx, setTx] = useState<WithError<string>>({
    value: '',
  });
  const [error, setError] = useState<string>();
  const [decodeResults, setDecodeResults] = useState<
    WithError<{
      tx: TypedTransaction;
      senderAddr: string;
    }>
  >();
  const [isPretty, setIsPretty] = useState(() => true);

  const decodeButtonDisabled = !tx.value && !!tx.error && !!error;

  const flushResults = (): void => {
    if (decodeResults) setDecodeResults(undefined);
  };

  const handleChangeRawTx = (newValue: string): void => {
    setError(undefined);
    return handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexValidator(newValue),
      setState: setTx,
      flushFn: flushResults,
    });
  };

  function handleDecodeCalldata(): void {
    flushResults();
    if (tx.value) {
      try {
        const decoded = decodeTx(tx.value);
        if (decoded) setDecodeResults({ value: decoded });
      } catch (error) {
        setError((error as Error).message);
      }
    }
  }

  return (
    <ToolContainer>
      <ToolHeader
        icon={<DecodersIcon height={24} width={24} />}
        text={['Decoders', 'Tx Decoder']}
      />
      <section>
        <ConversionInput
          name="raw transaction"
          id="tx-input"
          type="text"
          placeholder="0x0.."
          error={tx.error || error}
          onChange={({ target }) => handleChangeRawTx(target.value)}
        />
      </section>

      <Button
        onClick={handleDecodeCalldata}
        className="mt-4"
        disabled={decodeButtonDisabled}
        title={decodeButtonDisabled ? 'Please fill in the tx field' : undefined}
      >
        Decode
      </Button>

      {decodeResults?.value && (
        <section
          className="relative mt-6 overflow-hidden rounded-md border border-gray-600 bg-gray-900 p-8"
          placeholder="Output"
        >
          <NodeBlock className="my-1" str={decodeResults.value.senderAddr}>
            <p aria-label="decoded event arg index" className="text-gray-100">
              senderAddress
            </p>
          </NodeBlock>
          <h3 className="mb-2 text-lg">Format type</h3>
          <Toggle
            className="mb-4"
            buttonNames={['pretty', 'json']}
            useExternalState={[isPretty, setIsPretty]}
          />
          <div className="rounded-md border-y border-l border-gray-600 p-2">
            <TxDecoderResults
              decodeResults={decodeResults.value.tx}
              isPretty={isPretty}
            />
          </div>
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

interface AdequateTxDecoderResults {
  isPretty: boolean;
  decodeResults: TypedTransaction;
}

type TxDecoderResultsProps = Omit<AdequateTxDecoderResults, 'isPretty'>;

function TxDecoderResults({
  isPretty,
  decodeResults,
}: AdequateTxDecoderResults): ReactElement {
  return isPretty ? (
    <TxResultsPrettyFormat decodeResults={decodeResults} />
  ) : (
    <TxResultsJsonFormat decodeResults={decodeResults} />
  );
}

function TxResultsJsonFormat({
  decodeResults,
}: TxDecoderResultsProps): ReactElement {
  return (
    <output aria-label="result in json format">
      <div>
        <pre className="items-left flex flex-col text-clip text-sm">
          <p>{JSON.stringify(decodeResults, null, 2)}</p>
        </pre>
      </div>
    </output>
  );
}

function TxResultsPrettyFormat({
  decodeResults,
  isSubresult = false,
}: TxDecoderResultsProps & { isSubresult?: boolean }): ReactElement {
  return (
    <div
      aria-label={`${isSubresult ? 'subresult' : 'result'} in pretty format`}
      className="border-l border-gray-600 pl-2"
    >
      {Object.entries(decodeResults).map(([key, value], i) => {
        if (key === 'buf') {
          return (
            <NodeBlock str={addHexPrefix(bufferToHexString(value))} key={i}>
              <p
                aria-label="decoded event arg index"
                className="text-gray-300"
              >{`${key}`}</p>
            </NodeBlock>
          );
        }
        return typeof value === 'string' || typeof value === 'number' ? (
          <NodeBlock className="mt-1" str={value.toString()} key={i}>
            <p
              aria-label="decoded event arg index"
              className="text-gray-300"
            >{`${key}`}</p>
          </NodeBlock>
        ) : (
          !isElementEmpty(value) && (
            <Disclosure key={i} defaultOpen={true}>
              {({ open }) => (
                <>
                  <div className="flex gap-3">
                    <Disclosure.Button>
                      {!isElementEmpty(value) && (
                        <DisclosureArrow fill="white" open={open} />
                      )}
                    </Disclosure.Button>
                    {value && <p className="text-md text-gray-200">{key}</p>}
                  </div>
                  <Disclosure.Panel as="div">
                    {value && (
                      <TxResultsPrettyFormat
                        isSubresult={true}
                        decodeResults={value}
                      />
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          )
        );
      })}
    </div>
  );
}
