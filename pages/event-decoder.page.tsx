import { Interface } from '@ethersproject/abi';
import { ChangeEvent, useMemo, useState } from 'react';

import { Button } from '../src/components/Button';
import { Spinner } from '../src/components/Spinner';
import { decodeWithEventProps } from '../src/lib/decodeBySigHash';
import {
  DecodedEventResult,
  decodeEvent,
  EventProps,
} from '../src/lib/decodeEvent';
import { parseAbi } from '../src/lib/parseAbi';
import { assert } from '../src/misc/assert';

interface Topic {
  id: number;
  value: string;
}

export default function EventDecoder() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'abi' | '4-bytes'>('abi');

  const [rawAbi, setRawAbi] = useState<string>();

  const [topics, setTopics] = useState<Topic[] | undefined>([
    { id: 1, value: '' },
    { id: 2, value: '' },
    { id: 3, value: '' },
    { id: 4, value: '' },
  ]);
  const [data, setData] = useState<string>('');

  const [decodeResults, setDecodeResults] = useState<DecodedEventResult[]>();

  const signatureHash = useMemo(
    () => topics && topics.length > 0 && topics[0].value,
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
            topics: topics
              .filter((t) => t.value.trim().length > 0)
              .map((t) => t.value),
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
        topics: topics
          .filter((t) => t.value.trim().length > 0)
          .map((t) => t.value),
      };
      decodeResult = decodeEvent(abi, eventProps);
    } catch (e) {}

    if (!decodeResult) return;
    setDecodeResults([decodeResult]);
  }

  return (
    <div className="ml-64 mt-32 flex flex-col gap-14">
      <h1 className="border-b-2 border-dashed border-gray-300 pb-2">
        {' '}
        Event Decoder{' '}
      </h1>

      <div className="relative">
        <section className="mb-3">
          {topics &&
            topics.map((topic, i) => (
              <section className="flex items-center gap-2" key={i}>
                <div className="flex flex-1 flex-col">
                  <label className="pb-2" htmlFor={`${topic.id}`}>
                    {i === 0 ? <strong> topic{i} </strong> : <p> topic{i} </p>}
                  </label>
                  <input
                    id={`${topic.id}`}
                    type="text"
                    placeholder="e.g 0x0..."
                    className="mb-4 mr-auto h-10 w-3/5 rounded-xl border border-gray-400 text-sm focus:outline-none"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setTopics(
                        topics.map((t) =>
                          t.id === topic.id
                            ? { ...t, value: event.target.value }
                            : t,
                        ),
                      );
                    }}
                  />
                </div>
              </section>
            ))}
        </section>

        <section className="flex flex-1 flex-col">
          <label className="pb-1" htmlFor="data">
            data
          </label>
          <input
            id="data"
            type="text"
            placeholder="e.g 0x0..."
            className="mr-auto mb-4 h-10 w-3/5 rounded-xl border-gray-300 text-sm focus:outline-none"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setData(event.target.value)
            }
          />
        </section>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex text-lg">
          <button
            role="tab"
            aria-selected={tab === 'abi'}
            className={`flex-1 cursor-pointer rounded-tl-2xl border border-gray-400
            bg-gray-50 p-4 text-center hover:bg-black hover:text-white ${
              tab === 'abi' ? 'bg-black text-white' : 'bg-gray-50'
            }`}
            onClick={() => {
              setTab('abi');
              setDecodeResults(undefined);
            }}
          >
            ABI
          </button>

          <button
            role="tab"
            aria-selected={tab === '4-bytes'}
            className={`flex-1 cursor-pointer rounded-tr-2xl border border-gray-400
            bg-gray-50 p-4 text-center hover:bg-black hover:text-white ${
              tab === '4-bytes' ? 'bg-black text-white' : 'bg-gray-50'
            }`}
            onClick={() => {
              setTab('4-bytes');
              setDecodeResults(undefined);
            }}
          >
            4 bytes
          </button>
        </div>

        {tab === 'abi' && (
          <textarea
            id="abi"
            aria-label="text area for abi"
            value={rawAbi || ''}
            placeholder="e.g function transferFrom(address, ..)"
            className="flex h-36 w-full break-words rounded-b-2xl border-t-0
            border-gray-400 bg-gray-50 p-5"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setRawAbi(event.target.value);
            }}
          />
        )}
      </div>

      <Button
        onClick={() => void handleDecodeCalldata()}
        title={'Please fill in the calldata'}
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
              {signatureHash && (
                <div className="flex flex-wrap items-center gap-2 break-all">
                  <p className="font-bold text-purple-600">Signature hash</p>
                  <code data-testid="signature-hash">{signatureHash}</code>
                </div>
              )}
            </div>

            <div className="items-left flex flex-col text-ellipsis font-semibold">
              {decodeResults ? (
                tab === '4-bytes' && decodeResults.length > 0 ? (
                  <h3 className="text-md pb-4 font-semibold">
                    {' '}
                    Possible decoded event topics:{' '}
                  </h3>
                ) : (
                  ''
                )
              ) : (
                <h3 className="pb-4"> Decoded output will appear here </h3>
              )}

              {decodeResults?.map((d, i) => {
                return (
                  <section key={i}>
                    <div className="flex flex-col gap-2 pb-4">
                      {d.fullSignature}

                      <code>{'{'}</code>

                      {Object.entries(d.args).map(([key, value], i) => (
                        <code key={i}>
                          <strong className="font-bold text-purple-600">{` "${key}"`}</strong>
                          :{value.toString()}{' '}
                        </code>
                      ))}

                      <code>{'}'}</code>
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        </section>
      )}
    </div>
  );
}
