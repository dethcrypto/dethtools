import { Interface, ParamType } from '@ethersproject/abi';
import { ChangeEvent, ClipboardEvent, useMemo, useState } from 'react';

import { WithOkAndErrorMsgOptional } from '../src/misc/types';

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
import { hexSchema } from '../src/misc/schemas/hexSchema';
import { zodResultMessage } from '../src/misc/zodResultMessage';
import { parseEthersErrorMessage } from '../src/misc/parseEthersErrorMessage';

export interface CalldataDecoderProps {
  fetchAndDecode?: typeof fetchAndDecodeWithCalldata;
}

export default function CalldataDecoder({
  fetchAndDecode = fetchAndDecodeWithCalldata,
}: CalldataDecoderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [tab, setTab] = useState<'abi' | '4-bytes'>('4-bytes');
  const [decodeResults, setDecodeResults] = useState<
    {
      fnName?: string;
      fnType?: string;
      decoded: Decoded;
      inputs: ParamType[];
    }[]
  >();

  const [rawAbi, setRawAbi] = useState<WithOkAndErrorMsgOptional<string>>({
    isOk: true,
  });
  const [encodedCalldata, setEncodedCalldata] = useState<
    WithOkAndErrorMsgOptional<string>
  >({ isOk: true });

  const signatureHash = useMemo(
    () => encodedCalldata.inner && sigHashFromCalldata(encodedCalldata.inner),
    [encodedCalldata],
  );

  function handleChangeEncodedCalldata(
    event: ChangeEvent<HTMLTextAreaElement>,
  ) {
    const { value } = event.target;
    const parseResult = hexSchema.safeParse(value);
    setEncodedCalldata(() => {
      return { inner: value };
    });
    if (parseResult.success) {
      setEncodedCalldata((state) => {
        return { ...state, isOk: true };
      });
    } else {
      setEncodedCalldata((state) => {
        return {
          ...state,
          isOk: false,
          errorMsg: zodResultMessage(parseResult),
        };
      });
    }
    if (value.length === 0) {
      setEncodedCalldata((state) => {
        return {
          ...state,
          inner: value,
          isOk: true,
          errorMsg: undefined,
        };
      });
    }
  }

  function handleChangeRawAbi(event: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;
    setRawAbi(() => {
      return { inner: value };
    });
    // we're currently able to use three abi formats thanks to ethers
    // test if the interface is being created correctly from rawAbi
    try {
      parseAbi(value); // throws error if rawAbi format is not valid
      setRawAbi((state) => {
        return { ...state, isOk: true };
      });
    } catch (error) {
      setRawAbi((state) => {
        return {
          ...state,
          isOk: false,
          errorMsg: parseEthersErrorMessage((error as Error).message),
        };
      });
    }
    if (value.length === 0) {
      setRawAbi((state) => {
        return {
          ...state,
          inner: value,
          isOk: true,
          errorMsg: undefined,
        };
      });
    }
  }

  async function handleDecodeCalldata() {
    setError(undefined);

    if (!encodedCalldata.inner) return;
    if (!signatureHash) {
      setError('Signature hash is wrong or undefined');
      return;
    }

    if (tab === '4-bytes') {
      setLoading(true);

      let decodeResults: DecodeResult[] | undefined;

      try {
        decodeResults = await fetchAndDecode(
          signatureHash,
          encodedCalldata.inner,
        );
      } finally {
        setLoading(false);
      }

      if (!decodeResults) {
        setError('Signature is wrong or undefined');
        return;
      }

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
      if (!rawAbi.inner) {
        return;
      }
      const abi = parseAbi(rawAbi.inner) as Interface;
      decodeResult = decodeCalldata(abi, encodedCalldata.inner);
    } catch (e) {
      setError(
        "Provided ABI was in the wrong format or it didn't matched calldata",
      );
    }

    if (!decodeResult) return;

    const { decoded, fragment } = decodeResult;
    setDecodeResults([{ inputs: fragment.inputs, decoded }]);
  }

  const decodeButtonDisabled = !(
    (rawAbi.inner || tab === '4-bytes') &&
    encodedCalldata
  );

  const onDecodeClick = async () => {
    try {
      await handleDecodeCalldata();
    } catch (e) {
      // do not display generic error msg., as they are catched and displayed
      // in `handleDecodeCalldata` fn.
    }
  };

  return (
    <ToolContainer>
      <ToolHeader
        icon={<DecodersIcon height={24} width={24} />}
        text={['Decoders', 'Calldata Decoder']}
      />
      <label htmlFor="calldata">
        <span>Calldata</span>
      </label>
      <>
        <textarea
          id="calldata"
          value={encodedCalldata.inner || ''}
          placeholder="e.g 0x23b8..3b2"
          className={
            'h-20 break-words rounded-md border border-gray-600 bg-gray-900 ' +
            String(!encodedCalldata.isOk && ' border-error/75')
          }
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleChangeEncodedCalldata(event)
          }
          onPaste={(event: ClipboardEvent<HTMLTextAreaElement>) => {
            const encodedCalldata = event.clipboardData.getData('Text');
            const sigHash = sigHashFromCalldata(encodedCalldata);
            if (sigHash) {
              void fetch4BytesData(sigHash, 'signatures');
            }
          }}
        />
        <p
          aria-label="encoded calldata error"
          className="pt-1 text-right text-error"
        >
          {encodedCalldata.errorMsg}
        </p>
      </>
      <div className="mt-8 flex flex-col">
        <div className="flex text-lg">
          <button
            role="tab"
            aria-selected={tab === '4-bytes'}
            className={
              `h-12 flex-1 cursor-pointer p-1
            text-center duration-300 active:scale-105 active:bg-pink/50 ${
              tab === '4-bytes'
                ? 'rounded-l-md bg-pink'
                : 'rounded-tl-md bg-gray-600'
            }` + String(rawAbi.isOk ? ' border-gray-600' : ' border-error')
            }
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
            className={
              `h-12 flex-1 cursor-pointer p-1
            text-center duration-300 active:scale-105 active:bg-pink/50 ${
              tab === 'abi'
                ? 'rounded-tr-md bg-pink'
                : 'rounded-r-md bg-gray-600'
            }` + String(rawAbi.isOk ? ' border-gray-600' : ' bg-error/75')
            }
            onClick={() => {
              setTab('abi');
              setDecodeResults(undefined);
            }}
          >
            ABI
          </button>
        </div>

        {tab === 'abi' && (
          <>
            <textarea
              id="abi"
              aria-label="text area for abi"
              value={rawAbi.inner || ''}
              placeholder="e.g function transferFrom(address, ..)"
              className={
                'flex h-48 w-full break-words rounded-b-md border-t-0 bg-gray-900 p-5' +
                String(rawAbi.isOk ? ' border-gray-600' : ' border-error/75')
              }
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                handleChangeRawAbi(event)
              }
            />
            <p
              aria-label="raw abi error"
              className="pt-1 text-right text-error"
            >
              {rawAbi.errorMsg}
            </p>
          </>
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
          decodeResults.length > 0 ? (
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
      {loading ? (
        <Spinner className="mx-auto pt-6" />
      ) : (
        <section
          className="relative mb-16 rounded-md border border-gray-600 bg-gray-900 p-8"
          placeholder="Output"
        >
          <section className="flex flex-col gap-4">
            {!error && (
              <div>
                {signatureHash &&
                  decodeResults?.length! > 0 &&
                  hexSchema.safeParse(signatureHash).success && (
                    <div
                      className="m-0 flex cursor-pointer items-center gap-2 rounded-md border border-gray-600
                      py-2 px-3 duration-200 hover:bg-gray-700
                      hover:shadow-md hover:shadow-pink/25 hover:outline hover:outline-2
                    active:bg-gray-800"
                    >
                      <p className="text-purple-400 font-bold">
                        Signature hash
                      </p>
                      <b>{signatureHash}</b>
                    </div>
                  )}
              </div>
            )}

            {error ? (
              <p className="text-error">
                {error} with `{encodedCalldata.inner?.slice(0, 12)}`... encoded
                calldata
              </p>
            ) : (
              <div className="items-left flex flex-col text-ellipsis">
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
            )}
          </section>
        </section>
      )}
    </ToolContainer>
  );
}
