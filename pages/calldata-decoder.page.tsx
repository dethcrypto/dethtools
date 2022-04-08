import { Interface, ParamType } from '@ethersproject/abi';
import { ChangeEvent, ClipboardEvent, useMemo, useState } from 'react';

import { DecodedCalldataTree } from '../src/components/DecodedCalldataTree';
import { DecodersIcon } from '../src/components/icons/DecodersIcon';
import { Button } from '../src/components/lib/Button';
import { Spinner } from '../src/components/Spinner';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import {
  fetch4BytesData,
  fetchAndDecodeWithCalldata,
  sigHashFromCalldata,
} from '../src/lib/decodeBySigHash';
import {
  decodeCalldata,
  Decoded,
  DecodeResult,
} from '../src/lib/decodeCalldata';
import { parseAbi } from '../src/lib/parseAbi';
import { assert } from '../src/misc/assert';
import { sigHashSchema } from '../src/misc/sigHashSchema';

export interface CalldataDecoderProps {
  fetchAndDecode?: typeof fetchAndDecodeWithCalldata;
}

export default function CalldataDecoder({
  fetchAndDecode = fetchAndDecodeWithCalldata,
}: CalldataDecoderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const [tab, setTab] = useState<'abi' | '4-bytes'>('4-bytes');
  const [decodeResults, setDecodeResults] = useState<
    {
      fnName?: string;
      fnType?: string;
      decoded: Decoded;
      inputs: ParamType[];
    }[]
  >();

  const [rawAbi, setRawAbi] = useState<string>();
  const [encodedCalldata, setEncodedCalldata] = useState<string>();

  const signatureHash = useMemo(
    () => encodedCalldata && sigHashFromCalldata(encodedCalldata),
    [encodedCalldata],
  );

  async function handleDecodeCalldata() {
    setError(undefined);

    if (!encodedCalldata) return;

    assert(signatureHash, 'signatureHash must be defined');

    if (tab === '4-bytes') {
      setLoading(true);

      let decodeResults: DecodeResult[] | undefined;

      try {
        decodeResults = await fetchAndDecode(signatureHash, encodedCalldata);
      } finally {
        setLoading(false);
      }

      if (!decodeResults) return;

      const mappedResults = decodeResults.map((d) => {
        return {
          fnName: d.fragment.name,
          fnType: d.fragment.type,
          decoded: d.decoded,
          inputs: d.fragment.inputs,
        };
      });

      setDecodeResults(mappedResults);
    }

    let decodeResult: DecodeResult | undefined;
    try {
      if (!rawAbi) return;
      const abi = parseAbi(rawAbi) as Interface;
      decodeResult = decodeCalldata(abi, encodedCalldata);
    } catch (e) {}

    if (!decodeResult) return;

    const { decoded, fragment } = decodeResult;
    setDecodeResults([{ inputs: fragment.inputs, decoded }]);
  }

  const decodeButtonDisabled = !(
    (rawAbi || tab === '4-bytes') &&
    encodedCalldata
  );

  const onDecodeClick = () => void handleDecodeCalldata().catch(setError);

  return (
    <ToolContainer>
      <ToolHeader
        icon={<DecodersIcon height={24} width={24} />}
        text={['Decoders', 'Calldata Decoder']}
      />

      <label htmlFor="calldata">
        <span>Calldata</span>
      </label>

      <textarea
        id="calldata"
        value={encodedCalldata || ''}
        placeholder="e.g 0x23b8..3b2"
        className="mb-4 h-20 break-words rounded-md border border-gray-600 bg-gray-900 p-4"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setEncodedCalldata(event.target.value);
        }}
        onPaste={(event: ClipboardEvent<HTMLTextAreaElement>) => {
          const encodedCalldata = event.clipboardData.getData('Text');
          const sigHash = sigHashFromCalldata(encodedCalldata);
          if (sigHash) {
            void fetch4BytesData(sigHash, 'signatures');
          }
        }}
      />

      <div className="mt-8 flex flex-col">
        <div className="flex text-lg">
          <button
            role="tab"
            aria-selected={tab === '4-bytes'}
            className={`h-12 flex-1 cursor-pointer border-gray-600 p-1
            text-center duration-300 active:scale-105 active:bg-pink/50 ${
              tab === '4-bytes'
                ? 'rounded-l-md bg-pink'
                : 'rounded-tl-md bg-gray-600'
            }`}
            onClick={() => {
              setTab('4-bytes');
              setDecodeResults(undefined);
            }}
          >
            4 bytes
          </button>

          <button
            role="tab"
            aria-selected={tab === 'abi'}
            className={`h-12 flex-1 cursor-pointer border-gray-600 p-1
            text-center duration-300 active:scale-105 active:bg-pink/50 ${
              tab === 'abi'
                ? 'rounded-tr-md bg-pink'
                : 'rounded-r-md bg-gray-600'
            }`}
            onClick={() => {
              setTab('abi');
              setDecodeResults(undefined);
            }}
          >
            ABI
          </button>
        </div>

        {tab === 'abi' && (
          <textarea
            id="abi"
            aria-label="text area for abi"
            value={rawAbi || ''}
            placeholder="e.g function transferFrom(address, ..)"
            className="flex h-48 w-full break-words rounded-b-md border-t-0
            border-gray-600 bg-gray-900 p-5"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setRawAbi(event.target.value);
            }}
          />
        )}
      </div>

      <Button
        onClick={onDecodeClick}
        className="mt-6"
        disabled={decodeButtonDisabled}
        title={decodeButtonDisabled ? 'Please fill in the calldata' : undefined}
      >
        Decode
      </Button>

      <section className="pt-8 pb-3">
        {decodeResults ? (
          tab === '4-bytes' && decodeResults.length > 0 ? (
            <p className="text-md pb-4 font-semibold">
              Possible decoded calldata:
            </p>
          ) : (
            'No results found'
          )
        ) : (
          <p> Decoded output will appear here </p>
        )}
      </section>

      {error && (
        <pre className="font-mono">Failed to decode data: {error.message}</pre>
      )}
      {loading ? (
        <Spinner className="mx-auto pt-6" />
      ) : (
        <section
          className="relative mb-16 rounded-md border border-gray-600 bg-gray-900 p-8"
          placeholder="Output"
        >
          <section className="flex flex-col gap-4">
            <div>
              {signatureHash && sigHashSchema.safeParse(signatureHash).success && (
                <div
                  className="m-0 flex cursor-pointer items-center gap-2 rounded-md border
                    border-gray-600 py-1 px-3 duration-200 hover:bg-gray-700
                      hover:shadow-md hover:shadow-pink/25 hover:outline hover:outline-2
                    active:bg-gray-800"
                >
                  <p className="text-purple-400 font-bold">Signature hash</p>
                  <b>{signatureHash}</b>
                </div>
              )}
            </div>

            <div className="items-left flex flex-col text-ellipsis font-semibold">
              {decodeResults?.map((d, i) => {
                return (
                  <section key={i} data-testid={`decodedCalldataTree${i}`}>
                    <div className="pb-4">
                      <DecodedCalldataTree
                        fnName={d.fnName}
                        fnType={d.fnType}
                        decoded={d.decoded}
                        inputs={d.inputs}
                      />
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        </section>
      )}
    </ToolContainer>
  );
}
