import { Interface, ParamType } from '@ethersproject/abi';
import { ChangeEvent, useMemo, useState } from 'react';

import { Button } from '../src/components/Button';
import { DecodedCalldataTree } from '../src/components/DecodedCalldataTree';
import { Spinner } from '../src/components/Spinner';
import { ToolLayout } from '../src/layout/ToolLayout';
import {
  decodeWithCalldata,
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

export default function CalldataDecoder() {
  const [loading, setLoading] = useState(false);

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
    if (!encodedCalldata) return;

    assert(signatureHash, 'signatureHash must be defined');

    if (tab === '4-bytes') {
      setLoading(true);

      let decodeResults: DecodeResult[] | undefined;

      try {
        decodeResults = await decodeWithCalldata(
          signatureHash,
          encodedCalldata,
        );
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

  return (
    <ToolLayout>
      <h1> Calldata decoder </h1>

      <label htmlFor="calldata" className="text-lg font-bold">
        Calldata
      </label>
      <textarea
        id="calldata"
        value={encodedCalldata || ''}
        placeholder="e.g 0x23b8..3b2"
        className="h-20 break-words rounded-xl border border-gray-400 bg-gray-50 p-5"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setEncodedCalldata(event.target.value);
        }}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex text-lg">
          <button
            role="tab"
            aria-selected={tab === '4-bytes'}
            className={`flex-1 cursor-pointer rounded-tr-2xl border border-gray-400 bg-gray-50 p-4 text-center hover:bg-black hover:text-white ${
              tab === '4-bytes' ? 'bg-black text-white' : 'bg-gray-50'
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
            className={`flex-1 cursor-pointer rounded-tl-2xl border border-gray-400 bg-gray-50 p-4 text-center hover:bg-black hover:text-white ${
              tab === 'abi' ? 'bg-black text-white' : 'bg-gray-50'
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
            className="flex h-36 w-full break-words rounded-b-2xl border-t-0 border-gray-400 bg-gray-50 p-5"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setRawAbi(event.target.value);
            }}
          />
        )}
      </div>

      <Button
        onClick={() => void handleDecodeCalldata()}
        disabled={decodeButtonDisabled}
        title={decodeButtonDisabled ? 'Please fill in the calldata' : undefined}
      >
        Decode
      </Button>

      {loading ? (
        <Spinner className="mx-auto pt-12" />
      ) : (
        <section
          className="relative mb-16 rounded-xl border border-gray-400 bg-gray-50 p-8"
          placeholder="Output"
        >
          <section className="flex flex-col gap-4">
            <div>
              {signatureHash && sigHashSchema.safeParse(signatureHash).success && (
                <div className="flex items-center gap-2">
                  <p className="font-bold text-green-600">Signature hash</p>
                  <code data-testid="signature-hash">{signatureHash}</code>
                </div>
              )}
            </div>

            <div className="items-left flex flex-col text-ellipsis font-semibold">
              {decodeResults ? (
                tab === '4-bytes' && decodeResults.length > 0 ? (
                  <h3 className="text-md pb-4 font-semibold">
                    {' '}
                    Possible decoded calldata:{' '}
                  </h3>
                ) : (
                  'No results found'
                )
              ) : (
                'Decoded output will appear here'
              )}
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
    </ToolLayout>
  );
}
