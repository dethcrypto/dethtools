import { Interface, ParamType } from '@ethersproject/abi'
import { ChangeEvent, useState } from 'react'

import { DecodedCalldataTree } from '../components/DecodedCalldataTree'
import { decodeBySigHash } from '../lib/decodeBySigHash'
import { decodeCalldata, Decoded, DecodeResult } from '../lib/decodeCalldata'
import { parseAbi } from '../lib/parseAbi'
import { sigHashSchema } from '../misc/sigHashSchema'

export default function CalldataDecoder() {
  // abiMode set to true means that we deduce decode calldata by provided ABI,
  // otherwise the 4 bytes signature was provided instead
  const [tab, setTab] = useState<'abi' | '4-bytes'>('abi')
  const [decodeResults, setDecodeResults] =
    useState<{ fnName?: string; fnType?: string; decoded: Decoded; inputs: ParamType[] }[]>()

  const [rawAbi, setRawAbi] = useState<string>()
  const [encodedCalldata, setEncodedCalldata] = useState<string>()

  const [signatureHash, setSignatureHash] = useState<string>()

  async function handleDecodeCalldata() {
    if (!encodedCalldata) return

    if (tab === '4-bytes' && signatureHash && encodedCalldata) {
      const decodeResults = await decodeBySigHash(signatureHash, encodedCalldata)
      if (!decodeResults) return

      const mappedResults = decodeResults.map((d) => {
        return { fnName: d.fragment.name, fnType: d.fragment.type, decoded: d.decoded, inputs: d.fragment.inputs }
      })

      setDecodeResults(mappedResults)
    }

    let decodeResult: DecodeResult | undefined
    try {
      if (!rawAbi) return
      const abi = parseAbi(rawAbi) as Interface
      decodeResult = decodeCalldata(abi, encodedCalldata)
    } catch (e) {}

    if (!decodeResult) return

    const { decoded, fragment, sigHash } = decodeResult

    if (sigHashSchema.safeParse(sigHash).success) setSignatureHash(sigHash)
    setDecodeResults([{ inputs: fragment.inputs, decoded }])
  }

  function clearStates() {
    setDecodeResults(undefined)
    setSignatureHash(undefined)
    setRawAbi(undefined)
  }

  return (
    <div className="ml-64 mt-32 flex flex-col gap-10">
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
          setEncodedCalldata(event.target.value)
        }}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex cursor-pointer rounded-md border-x border-t border-gray-400 bg-gray-50 text-lg">
          <button
            className={`flex-1 cursor-pointer p-4 text-center hover:bg-black hover:text-white ${
              tab === 'abi' ? 'bg-black text-white' : 'bg-gray-50'
            }`}
            onClick={() => {
              setTab('abi')
              clearStates()
            }}
          >
            ABI
          </button>

          <button
            className={`flex-1 cursor-pointer p-4 text-center hover:bg-black hover:text-white ${
              tab === '4-bytes' ? 'bg-black text-white' : 'bg-gray-50'
            }`}
            onClick={() => {
              setTab('4-bytes')
              clearStates()
            }}
          >
            4 bytes
          </button>
        </div>

        {tab === 'abi' ? (
          <textarea
            id="abi"
            aria-label="text area for abi"
            value={rawAbi || ''}
            placeholder="e.g function transferFrom(address, ..)"
            className="flex h-36 w-full break-words rounded-2xl rounded-t border-b border-gray-400 bg-gray-50 p-5"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setRawAbi(event.target.value)
            }}
          />
        ) : (
          <textarea
            id="4bytes"
            aria-label="text area for 4 bytes signature hash"
            value={signatureHash || ''}
            placeholder="e.g 0x1337"
            className={'flex h-36 w-full break-words rounded-2xl rounded-t border-b border-gray-400 bg-gray-50 p-5'}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setSignatureHash(event.target.value)
            }}
          />
        )}
      </div>

      <button
        className={
          (signatureHash || rawAbi) && encodedCalldata
            ? 'rounded-md bg-black px-1 py-4 text-sm text-white'
            : 'rounded-md bg-gray-800 px-1 py-4 text-sm text-white'
        }
        onClick={handleDecodeCalldata}
        disabled={!((rawAbi || signatureHash) && encodedCalldata)}
      >
        Decode
      </button>

      {decodeResults && (
        <section className="relative mb-16 rounded-xl border border-gray-400 bg-gray-50 p-8" placeholder="Output">
          <section className="flex flex-col gap-4">
            <div>
              {sigHashSchema.safeParse(signatureHash).success && (
                <div className="flex items-center gap-2">
                  <p className="font-bold text-green-600">Signature hash</p>
                  <code data-testid="signature-hash">{signatureHash}</code>
                </div>
              )}
            </div>

            <div className="items-left flex flex-col text-ellipsis font-semibold">
              {tab === '4-bytes' && !(decodeResults.length === 0) ? (
                <h3 className="text-md pb-4 font-semibold"> Possible decoded calldata: </h3>
              ) : (
                'No results found'
              )}
              {decodeResults.map((d, i) => {
                return (
                  <section key={i}>
                    <div className="pb-4" data-testid={`decodedCalldataTree${i}`}>
                      <DecodedCalldataTree fnName={d.fnName} fnType={d.fnType} decoded={d.decoded} inputs={d.inputs} />{' '}
                    </div>
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
