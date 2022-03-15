import { Fragment, ParamType } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { zip } from 'lodash'
import { ChangeEvent, useState } from 'react'

import { decodeCalldata } from '../lib/decodeCalldata'
import { parseAbi } from '../lib/parseAbi'

type Decoded = string | BigNumber

export default function CalldataDecoder() {
  const [rawAbi, setRawAbi] = useState('function transferFrom(address,address,uint256)')
  const [encodedCalldata, setEncodedCalldata] = useState(
    '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
  )
  const [decoded, setDecoded] = useState<readonly unknown[]>()
  const [fragment, setFragment] = useState<Fragment>()

  function handleDecodeCalldata() {
    const abi = parseAbi(rawAbi)
    if (abi) {
      const decodeResult = decodeCalldata(abi, encodedCalldata)
      if (decodeResult) {
        const { decoded, fragment } = decodeResult
        setDecoded(decoded)
        setFragment(fragment)
      }
    }
  }
  function fmtInputParam(param: ParamType): JSX.Element {
    return (
      <div className="flex items-center gap-3 font-semibold">
        {(param as ParamType).name ? (
          (param as ParamType).name
        ) : (
          <p className="text-sm text-gray-500"> Name missing in ABI </p>
        )}
        {(param as Record<string, any>).type}
      </div>
    )
  }
  function fmtDecoded(decoded: Decoded): JSX.Element {
    return <div> {typeof decoded === 'string' ? decoded : (decoded as BigNumber)._hex} </div>
  }

  return (
    <div className="flex ml-auto max-w-4/5 pl-48 mt-32">
      <div className="flex flex-col gap-10 mx-auto w-96">
        <h1> Calldata decoder </h1>
        <h3> Enter calldata </h3>

        <textarea
          placeholder="0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000"
          className="h-36 border border-black border-dashed bg-gray-100 p-3"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            setEncodedCalldata(event.target.value)
          }}
        />

        <h3> Enter human-readable ABI </h3>

        <textarea
          placeholder="function transferFrom(address,address,uint256)"
          className="h-36 border border-black border-dashed bg-gray-100 p-3"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            setRawAbi(event.target.value)
          }}
        />

        <button className="text-md px-1 py-3  bg-black text-white rounded-md" onClick={handleDecodeCalldata}>
          Decode
        </button>

        <h3> Output </h3>

        <section className="border border-black border-dashed bg-gray-100 p-3 mb-24" placeholder="Output">
          <section className="flex flex-col gap-4">
            {zip(decoded, fragment?.inputs).map((tupl, i) => {
              return (
                <div key={i}>
                  <div className="flex items-center gap-3 font-semibold"> {fmtInputParam(tupl[1] as any)} </div>
                  <div> {fmtDecoded(tupl[0] as any)} </div>
                </div>
              )
            })}
          </section>
        </section>
      </div>
    </div>
  )
}
