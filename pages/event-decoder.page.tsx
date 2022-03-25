import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import Img from 'next/image'
import { ChangeEvent, Key, useMemo, useState } from 'react'

import { Button } from '../components/Button'
import { Spinner } from '../components/Spinner'
import { decodeWithEventProps } from '../lib/decodeBySigHash'
import { decodeEvent, DecodeEventResult, EventProps } from '../lib/decodeEvent'
import { parseAbi } from '../lib/parseAbi'
import { assert } from '../misc/assert'

interface Topic {
  id: string
  title: string
  value: string
}

export default function EventDecoder() {
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'abi' | '4-bytes'>('abi')

  const [rawAbi, setRawAbi] = useState<string>()

  const [topics, setTopics] = useState<Topic[] | undefined>([
    {
      id: Math.random().toString(36).slice(2, 9),
      title: 'topic',
      value: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    },
    {
      id: Math.random().toString(36).slice(2, 9),
      title: 'topic',
      value: '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
    },
    {
      id: Math.random().toString(36).slice(2, 9),
      title: 'topic',
      value: '0x000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c',
    },
  ])
  const [data, setData] = useState<string>('0x0000000000000000000000000000000000000000000000000de0b6b3a7640000')

  const [decodeResults, setDecodeResults] = useState<DecodeEventResult[]>()

  const signatureHash = useMemo(() => topics && topics.length > 0 && topics[0].value, [topics])

  async function handleDecodeCalldata() {
    setDecodeResults(undefined)
    assert(signatureHash, 'signatureHash must be defined')

    if (tab === '4-bytes') {
      setLoading(true)

      let decodeResults: DecodeEventResult[] | undefined

      try {
        if (topics && data) {
          const eventProps: EventProps = { data: data, topics: topics.map((t) => t.value) }
          decodeResults = await decodeWithEventProps(signatureHash, eventProps)
        }
      } finally {
        setLoading(false)
      }

      if (decodeResults) {
        setDecodeResults(decodeResults)
      }
    }

    let decodeResult: DecodeEventResult | undefined
    try {
      if (!rawAbi) return
      const abi = parseAbi(rawAbi)

      if (!(abi instanceof Interface) || !data || !topics) return
      const eventProps: EventProps = { data: data, topics: topics.map((t) => t.value) }
      decodeResult = decodeEvent(abi, eventProps)
    } catch (e) {}

    if (!decodeResult) return
    setDecodeResults([decodeResult])
  }

  return (
    <div className="ml-64 mt-32 flex flex-col gap-14">
      <h1> Event Decoder </h1>

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
              setTab('abi')
              setDecodeResults(undefined)
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
              setTab('4-bytes')
              setDecodeResults(undefined)
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
              setRawAbi(event.target.value)
            }}
          />
        )}
      </div>

      <div className="relative h-72">
        <section className="flex flex-1 flex-col">
          <label htmlFor="data"> data </label>
          <input
            id="data"
            type="text"
            placeholder="e.g 0x0..."
            className="mr-auto mb-4 h-10 w-3/5 rounded-xl border-black text-sm focus:outline-none"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setData(event.target.value)}
          />
        </section>
        {topics &&
          topics.map((topic, i) => (
            <section className="flex items-center gap-2" key={i}>
              <button className="pt-3" onClick={() => setTopics(topics.filter((t) => t.id !== topic.id))}>
                <Img src="/static/svg/delete-x.svg" height={30} width={30} />
              </button>

              <div className="flex flex-1 flex-col">
                <label htmlFor={topic.id}> topic {i === 0 ? <strong> {i} </strong> : i} </label>
                <input
                  id={topic.id}
                  type="text"
                  placeholder="e.g 0x0..."
                  className="mb-4 mr-auto h-10 w-3/5 rounded-xl border-black text-sm focus:outline-none"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setTopics(topics.map((t) => (t.id === topic.id ? { ...t, value: event.target.value } : t)))
                  }}
                />
              </div>
            </section>
          ))}
        <Button
          className="absolute right-0 bottom-0 w-1/4"
          onClick={() =>
            topics &&
            topics.length < 4 &&
            setTopics([...topics, { id: Math.random().toString(36).slice(2, 9), title: 'a', value: '' }])
          }
        >
          New topic
        </Button>
      </div>

      <Button onClick={() => void handleDecodeCalldata()} disabled={false} title={'Please fill in the calldata'}>
        Decode
      </Button>

      {loading ? (
        <Spinner className="mx-auto pt-12" />
      ) : (
        <section className="relative mb-16 rounded-xl border border-gray-400 bg-gray-50 p-8" placeholder="Output">
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
                  <h3 className="text-md pb-4 font-semibold"> Possible decoded event topics: </h3>
                ) : (
                  ''
                )
              ) : (
                <h3 className="pb-4"> Decoded output will appear here </h3>
              )}

              {decodeResults?.map((d, i) => {
                return (
                  <section key={i}>
                    {d.isNamedResult ? (
                      <div className="flex flex-col gap-2 pb-4">
                        {d.eventFragment[0]}

                        <code>{'{'}</code>

                        {Object.entries(d.decodedTopics).map(([key, value], i) => (
                          <code key={i}>
                            <strong className="font-bold text-purple-600">{` "${key}"`}</strong>:
                            {typeof value === 'string' ? ` ${value}` : ` "${value._hex}"`}{' '}
                          </code>
                        ))}

                        <code>{'}'}</code>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 pb-4">
                        <code>
                          <strong className="text-purple-600"> {d.eventFragment[1].type} </strong>
                          {d.eventFragment[1].name} ({d.eventFragment[1].inputs.map((i) => i.type).join(', ')})
                        </code>

                        <code>{'{'}</code>

                        {(d.decodedTopics as Record<string, any>).map((value: string | BigNumber, i: Key) => (
                          <code key={i}>
                            <strong className="font-bold text-purple-600">{`"arg${i}"`}</strong>:
                            {typeof value === 'string' ? ` "${value}"` : ` "${value._hex}"`}{' '}
                          </code>
                        ))}

                        <code>{'}'}</code>
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          </section>
        </section>
      )}
    </div>
  )
}
