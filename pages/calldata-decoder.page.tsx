import { Fragment, ParamType } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { zip } from 'lodash'
import { ChangeEvent, useState } from 'react'

import { decodeCalldata } from '../lib/decodeCalldata'
import { parseAbi } from '../lib/parseAbi'

type Decoded = string | BigNumber

export default function CalldataDecoder() {
  const [rawAbi, setRawAbi] = useState('')
  const [encodedCalldata, setEncodedCalldata] = useState('')
  const [decoded, setDecoded] = useState<readonly unknown[]>()
  const [fragment, setFragment] = useState<Fragment>()
  const [sigHash, setSigHash] = useState('')

  function handleDecodeCalldata() {
    const abi = parseAbi(rawAbi)
    if (abi) {
      const decodeResult = decodeCalldata(abi, encodedCalldata)
      if (decodeResult) {
        const { decoded, fragment, sigHash } = decodeResult
        setDecoded(decoded)
        setFragment(fragment)
        setSigHash(sigHash)
      }
    }
  }
  function fmtInputParam(param: ParamType): JSX.Element {
    return (
      <div className="flex items-center gap-3 font-semibold">
        {(param as ParamType).name ? (
          (param as ParamType).name + ' '
        ) : (
          <p className="text-sm text-gray-500"> Name missing in ABI </p>
        )}
        <p data-testid="inputParam">{(param as Record<string, any>).type}</p>
      </div>
    )
  }
  function fmtDecoded(decoded: Decoded): JSX.Element {
    return <p data-testid="decoded"> {typeof decoded === 'string' ? decoded : (decoded as BigNumber)._hex} </p>
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
        className="h-36 break-words border border-dashed border-black bg-gray-50 p-5"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setEncodedCalldata(event.target.value)
        }}
      />

      <label htmlFor="abi" className="text-lg font-bold">
        Human-readable ABI
      </label>
      <textarea
        id="abi"
        placeholder="e.g function transferFrom(address, ..)"
        className="h-36 break-words border border-dashed border-black bg-gray-100 p-5"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setRawAbi(event.target.value)
        }}
      />

      <button className="text-md rounded-md bg-black  px-1 py-3 text-white" onClick={handleDecodeCalldata}>
        Decode
      </button>

      <label htmlFor="output" className="text-lg font-bold">
        Output
      </label>
      <section className="mb-24 border border-dashed border-black bg-gray-100 p-5" placeholder="Output">
        <section className="flex flex-col gap-4 break-words">
          <div data-testid="sigHash"> {sigHash && `Signature hash: ${sigHash}`} </div>
          {zip(decoded, fragment?.inputs).map((tupl, i) => {
            return (
              <section key={i}>
                <div className="flex items-center gap-3 font-semibold">
                  <div>{fmtInputParam(tupl[1] as ParamType)}</div>
                  <div>{fmtDecoded(tupl[0] as Decoded)}</div>
                </div>
              </section>
            )
          })}
        </section>
      </section>
    </div>
  )
}
