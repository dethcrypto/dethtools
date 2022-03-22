/* eslint-disable no-tabs */
import { Interface, ParamType } from '@ethersproject/abi'
import { ChangeEvent, useState } from 'react'

import { DecodedCalldataTree } from '../components/DecodedCalldataTree'
import { decodeCalldata, Decoded } from '../lib/decodeCalldata'
import { parseAbi } from '../lib/parseAbi'

export default function CalldataDecoder() {
  const [rawAbi, setRawAbi] = useState('')

  const [encodedCalldata, setEncodedCalldata] = useState('')
  const [decoded, setDecoded] = useState<Decoded>()
  const [inputs, setInputs] = useState<ParamType[]>()
  const [sigHash, setSigHash] = useState('')

  function handleDecodeCalldata() {
    const abi = parseAbi(rawAbi)

    if (abi instanceof Interface) {
      const decodeResult = decodeCalldata(abi, encodedCalldata)

      if (decodeResult) {
        const { decoded, fragment, sigHash } = decodeResult
        setDecoded(decoded)
        setInputs(fragment.inputs)
        setSigHash(sigHash)
      }
    }
  }

  return (
    <div className="ml-64 mt-32 flex flex-col gap-10">
      <h1> Calldata decoder </h1>

      <label htmlFor="calldata" className="text-lg font-bold">
        Calldata
      </label>
      <textarea
        id="calldata"
        placeholder="e.g 0x23b8..3b2"
        className="h-20 break-words rounded-xl border border-gray-400 bg-gray-50 p-5"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setEncodedCalldata(event.target.value)
        }}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex cursor-pointer rounded-md border-x border-t border-gray-400 bg-gray-50 text-lg">
          <label htmlFor="abi" className="flex-1 border-r-2 p-3 text-center">
            ABI
          </label>
        </div>

        <textarea
          id="abi"
          placeholder="e.g function transferFrom(address, ..)"
          className={'flex h-36 w-full break-words rounded-2xl rounded-t border-b border-gray-400 bg-gray-50 p-5'}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            setRawAbi(event.target.value)
          }}
        />
      </div>

      <button
        className={
          rawAbi && encodedCalldata
            ? 'rounded-md bg-black px-1 py-4 text-sm text-white'
            : 'rounded-md bg-gray-700 px-1 py-4 text-sm text-white'
        }
        onClick={handleDecodeCalldata}
        disabled={!(rawAbi && encodedCalldata)}
      >
        Decode
      </button>

      {decoded && (
        <section className="relative mb-16 rounded-xl border border-gray-400 bg-gray-50 p-8" placeholder="Output">
          <section className="flex flex-col gap-3">
            <div className="flex gap-3 pb-2" data-testid="sigHash">
              <p className="pl-1 font-semibold"> {sigHash && 'Signature hash '} </p>
              <code> {sigHash} </code>
            </div>

            <div className="flex items-center gap-3 font-semibold">
              <DecodedCalldataTree decoded={decoded} inputs={inputs as ParamType[]} />
            </div>
          </section>
        </section>
      )}
    </div>
  )
}
