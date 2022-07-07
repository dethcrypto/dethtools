import { Interface } from '@ethersproject/abi';
import { addHexPrefix } from 'ethereumjs-util';
import { ChangeEvent, ClipboardEvent, useMemo, useState } from 'react';

import { DecodersIcon } from '../src/components/icons/DecodersIcon';
import { Button } from '../src/components/lib/Button';
import { NodeBlock } from '../src/components/NodeBlock';
import { Spinner } from '../src/components/Spinner';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import {
  decodeWithEventProps,
  fetch4BytesData,
} from '../src/lib/decodeBySigHash';
import {
  DecodedEventResult,
  decodeEvent,
  EventProps,
} from '../src/lib/decodeEvent';
import { parseAbi } from '../src/lib/parseAbi';
import { parseEthersErrorMessage } from '../src/misc/parseEthersErrorMessage';
import { hexSchema } from '../src/misc/schemas/hexSchema';
import {
  WithOkAndErrorMsg,
  WithOkAndErrorMsgOptional,
} from '../src/misc/types';
import { zodResultMessage } from '../src/misc/zodResultMessage';

interface HandleChangeTopic {
  index: number;
  event: ChangeEvent<HTMLInputElement>;
  isPasted: false;
}

interface HandlePasteTopic {
  index: number;
  event: ClipboardEvent<HTMLInputElement>;
  isPasted: true;
}

export default function EventDecoder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [tab, setTab] = useState<'abi' | '4-bytes'>('4-bytes');

  const [rawAbi, setRawAbi] = useState<WithOkAndErrorMsgOptional<string>>({
    isOk: true,
  });
  const [data, setData] = useState<WithOkAndErrorMsg<string>>({
    inner: '',
    isOk: true,
  });
  const [topics, setTopics] = useState<WithOkAndErrorMsg<string>[] | undefined>(
    [
      { inner: '', isOk: true },
      { inner: '', isOk: true },
      { inner: '', isOk: true },
      { inner: '', isOk: true },
    ],
  );

  const [decodeResults, setDecodeResults] = useState<DecodedEventResult[]>();

  const signatureHash = useMemo(
    () => topics && topics.length > 0 && topics[0],
    [topics],
  );

  function handleChangeTopic({
    index,
    event,
    isPasted,
  }: HandleChangeTopic | HandlePasteTopic): void {
    if (!topics) return;
    let value: string;
    if (isPasted) {
      value = event.clipboardData.getData('text/plain');
    } else {
      value = event.target.value;
    }
    const parseResult = hexSchema.safeParse(value);
    const stateBeforeIndex = (state: WithOkAndErrorMsg<string>[]) => {
      return [...state.slice(0, index)];
    };
    const stateAfterIndex = (state: WithOkAndErrorMsg<string>[]) => {
      return [...state.slice(index + 1)];
    };
    setTopics((state) => {
      if (!state) return;
      return [
        ...stateBeforeIndex(state),
        {
          ...state[index],
          inner: value,
        },
        ...stateAfterIndex(state),
      ];
    });
    if (parseResult.success) {
      setTopics((state) => {
        if (!state) return;
        return [
          ...stateBeforeIndex(state),
          { ...state[index], isOk: true, errorMsg: undefined },
          ...stateAfterIndex(state),
        ];
      });
    } else {
      setTopics((state) => {
        if (!state) return;
        return [
          ...stateBeforeIndex(state),
          {
            ...state[index],
            isOk: false,
            errorMsg: zodResultMessage(parseResult),
          },
          ...stateAfterIndex(state),
        ];
      });
    }
    if (value.length === 0) {
      setTopics((state) => {
        if (!state) return;
        return [
          ...stateBeforeIndex(state),
          {
            ...state[index],
            inner: value,
            isOk: true,
            errorMsg: undefined,
          },
          ...stateAfterIndex(state),
        ];
      });
    }
  }

  function handleChangeData(event: ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;
    value = addHexPrefix(value);
    const parseResult = hexSchema.safeParse(value);
    setData({ inner: value });
    if (parseResult.success) {
      setData({ inner: value, isOk: true, errorMsg: undefined });
    } else {
      setData({
        inner: value,
        isOk: false,
        errorMsg: zodResultMessage(parseResult),
      });
    }
    if (value.length === 0) {
      setData({ inner: value, isOk: true, errorMsg: undefined });
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
    setDecodeResults(undefined);
    if (!signatureHash) {
      setError('Signature hash is wrong or undefined');
      return;
    }
    if (tab === '4-bytes') {
      setLoading(true);
      let decodeResults: DecodedEventResult[] | undefined;
      try {
        if (topics && data.inner) {
          const eventProps: EventProps = {
            data: data.inner,
            topics: topics
              .filter(({ inner }) => inner && inner.trim().length > 0)
              .map((t) => t.inner),
          };
          decodeResults = await decodeWithEventProps(
            signatureHash.inner,
            eventProps,
          );
        }
      } catch (e) {
        setError(
          "Provided event couldn't be decoded, maybe there are too few topics?",
        );
      } finally {
        setLoading(false);
      }

      if (decodeResults) {
        setError('');
        setDecodeResults(decodeResults);
      }
    }

    let decodeResult: DecodedEventResult | undefined;
    try {
      if (!rawAbi.inner) return;
      const abi = parseAbi(rawAbi.inner);

      if (!(abi instanceof Interface) || !data.inner || !topics) return;
      const eventProps: EventProps = {
        data: data.inner,
        topics: topics
          .filter(({ inner }) => inner.trim().length > 0)
          .map((t) => t.inner),
      };
      decodeResult = decodeEvent(abi, eventProps);
    } catch (e) {
      setError(
        "Provided event couldn't be decoded, maybe there are too few topics?",
      );
    }

    if (!decodeResult) return;
    setDecodeResults([decodeResult]);
  }

  const decodeButtonDisabled = !(
    topics &&
    data.inner &&
    (rawAbi.inner || tab === '4-bytes')
  );

  return (
    <ToolContainer>
      <ToolHeader
        icon={<DecodersIcon height={24} width={24} />}
        text={['Decoders', 'Event Decoder']}
      />

      <div className="relative">
        <section className="mb-4">
          {topics &&
            topics.map((_, index) => (
              <section className="flex items-center gap-2" key={index}>
                <div className="flex flex-1 flex-col">
                  <label className="pb-2" htmlFor={`${index}`}>
                    <div>
                      {index === 0 ? <b>topic{index}</b> : <p>topic{index}</p>}
                    </div>
                  </label>

                  <>
                    <input
                      id={`${index}`}
                      type="text"
                      placeholder="e.g 0x0..."
                      className={
                        'mb-2 mr-auto h-12 w-full rounded-md border' +
                        ' bg-gray-900 text-sm focus:outline-none' +
                        String(
                          topics[index].isOk
                            ? ' border-gray-600'
                            : ' border-error/75',
                        )
                      }
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleChangeTopic({ index, event, isPasted: false })
                      }
                      onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
                        handleChangeTopic({ index, event, isPasted: true });
                        if (index !== 0) return;
                        const topicValue = event.clipboardData.getData('Text');
                        const sigHash = topicValue;
                        if (sigHash) {
                          void fetch4BytesData(sigHash, 'event-signatures');
                        }
                      }}
                    />
                    <p
                      aria-label={'topic ' + String(index) + ' error'}
                      className="text-right text-error"
                    >
                      {topics[index].errorMsg}
                    </p>
                  </>
                </div>
              </section>
            ))}
        </section>

        <section className="mb-6 flex flex-1 flex-col">
          <label className="pb-1" htmlFor="data">
            data
          </label>

          <>
            <input
              id="data"
              type="text"
              placeholder="e.g 0x0..."
              className={
                'mb-4 mr-auto h-12 w-full rounded-md border border-gray-600' +
                ' bg-gray-900 text-sm focus:outline-none' +
                String(data.isOk ? ' border-gray-600' : ' border-error/75')
              }
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleChangeData(event)
              }
            />
            <p className="text-right text-error">{data.errorMsg}</p>
          </>
        </section>
      </div>

      <div className="flex flex-col">
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
            className={
              `h-12 flex-1 cursor-pointer border-gray-600 p-1
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
                'flex h-48 w-full break-words rounded-b-md border-t-0' +
                ' bg-gray-900 p-5' +
                String(rawAbi.isOk ? ' border-gray-600' : ' border-error/75')
              }
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                handleChangeRawAbi(event)
              }
            />
            <p className="pt-1 text-right text-error">{rawAbi.errorMsg}</p>
          </>
        )}
      </div>

      <Button
        onClick={() => void handleDecodeCalldata()}
        className="mt-6"
        disabled={decodeButtonDisabled}
        title={
          decodeButtonDisabled
            ? 'Please fill in the topics, data and abi if this tab is selected'
            : undefined
        }
      >
        Decode
      </Button>

      <section className="pt-8 pb-3">
        {decodeResults ? (
          tab === '4-bytes' && decodeResults.length > 0 ? (
            <p className="text-md pb-4 font-semibold">
              Possible decoded results:
            </p>
          ) : (
            'No results found'
          )
        ) : (
          <p> Decoded output will appear here </p>
        )}
      </section>

      {loading ? (
        <Spinner className="mx-auto pt-12" />
      ) : (
        <section
          className="relative mb-16 rounded-md border border-gray-600 bg-gray-900 p-8"
          placeholder="Output"
        >
          <section className="flex flex-col gap-4 break-words">
            {signatureHash && decodeResults?.length! > 0 && (
              <NodeBlock className="my-2" str={signatureHash.inner || '0x0'}>
                <div className="flex items-center gap-2">
                  <p className="truncate">Signature hash</p>
                </div>
              </NodeBlock>
            )}

            {error ? (
              <p className="text-error">{error}</p>
            ) : (
              <div className="items-left flex flex-col text-ellipsis font-semibold">
                {decodeResults?.map((d, i) => {
                  return (
                    <section key={i}>
                      <div className="flex flex-col gap-2">
                        <p>{d.fullSignature}</p>
                        <p>{'{'}</p>
                        {Object.entries(d.args).map(([key, value], i) => (
                          <NodeBlock
                            className="my-1"
                            str={value.toString()}
                            key={i}
                          >
                            <p
                              aria-label="decoded event arg index"
                              className="text-purple-600"
                            >{` "${key}"`}</p>
                          </NodeBlock>
                        ))}
                        <p>{'}'}</p>
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
