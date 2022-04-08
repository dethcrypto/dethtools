import { Interface } from '@ethersproject/abi';
import { addHexPrefix } from 'ethereumjs-util';
import { ChangeEvent, ClipboardEvent, useMemo, useState } from 'react';
import { Tips } from '../src/components/Tips';
import { decoderTips } from '../src/components/Tips/calculatorTips';

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
import { assert } from '../src/misc/assert';

export default function EventDecoder() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'abi' | '4-bytes'>('4-bytes');

  const [rawAbi, setRawAbi] = useState<string>();

  const [topics, setTopics] = useState<string[] | undefined>(['', '', '', '']);
  const [data, setData] = useState<string>('');

  const [decodeResults, setDecodeResults] = useState<DecodedEventResult[]>();

  const signatureHash = useMemo(
    () => topics && topics.length > 0 && topics[0],
    [topics],
  );

  async function handleDecodeCalldata() {
    setDecodeResults(undefined);
    assert(signatureHash, 'signatureHash must be defined');

    if (tab === '4-bytes') {
      setLoading(true);

      let decodeResults: DecodedEventResult[] | undefined;

      try {
        if (topics && data) {
          const eventProps: EventProps = {
            data: data,
            topics: topics.filter((t) => t.trim().length > 0).map((t) => t),
          };
          decodeResults = await decodeWithEventProps(signatureHash, eventProps);
        }
      } finally {
        setLoading(false);
      }

      if (decodeResults) {
        setDecodeResults(decodeResults);
      }
    }

    let decodeResult: DecodedEventResult | undefined;
    try {
      if (!rawAbi) return;
      const abi = parseAbi(rawAbi);

      if (!(abi instanceof Interface) || !data || !topics) return;
      const eventProps: EventProps = {
        data: data,
        topics: topics.filter((t) => t.trim().length > 0).map((t) => t),
      };
      decodeResult = decodeEvent(abi, eventProps);
    } catch (e) {}

    if (!decodeResult) return;
    setDecodeResults([decodeResult]);
  }

  const decodeButtonDisabled = !(
    topics &&
    data &&
    (rawAbi || tab === '4-bytes')
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
            topics.map((_topic, i) => (
              <section className="flex items-center gap-2" key={i}>
                <div className="flex flex-1 flex-col">
                  <label className="pb-2" htmlFor={`${i}`}>
                    <div>{i === 0 ? <b>topic{i}</b> : <p>topic{i}</p>}</div>
                  </label>

                  <input
                    id={`${i}`}
                    type="text"
                    placeholder="e.g 0x0..."
                    className="mb-2 mr-auto h-12 w-full rounded-md border border-gray-600 bg-gray-900 text-sm focus:outline-none"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setTopics(
                        topics.map((topic, id) =>
                          i === id ? addHexPrefix(event.target.value) : topic,
                        ),
                      );
                    }}
                    onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
                      if (i !== 0) return;
                      const topicValue = event.clipboardData.getData('Text');
                      const sigHash = topicValue;
                      if (sigHash) {
                        void fetch4BytesData(sigHash, 'event-signatures');
                      }
                    }}
                  />
                </div>
              </section>
            ))}
        </section>

        <section className="mb-6 flex flex-1 flex-col">
          <label className="pb-1" htmlFor="data">
            data
          </label>

          <input
            id="data"
            type="text"
            placeholder="e.g 0x0..."
            className="mb-4 mr-auto h-12 w-full rounded-md border border-gray-600 bg-gray-900 text-sm focus:outline-none"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setData(addHexPrefix(event.target.value))
            }
          />
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
        <Spinner className="mx-auto pt-12" />
      ) : (
        <section
          className="relative mb-16 rounded-md border border-gray-600 bg-gray-900 p-8"
          placeholder="Output"
        >
          <section className="flex flex-col gap-4 break-words">
            {signatureHash && decodeResults && (
              <NodeBlock
                className="my-2"
                str={(signatureHash as string) || '0x0'}
              >
                <div className="flex items-center gap-2">
                  <p className="truncate">Signature hash</p>
                </div>
              </NodeBlock>
            )}

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
                          <p className="text-purple-600">{` "${key}"`}</p>
                        </NodeBlock>
                      ))}
                      <p>{'}'}</p>
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        </section>
      )}
      <Tips texts={decoderTips} />
    </ToolContainer>
  );
}
