/* eslint-disable no-tabs */
import { Interface, ParamType } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { zip } from 'lodash'
import { ChangeEvent, useState } from 'react'

import { decodeCalldata } from '../lib/decodeCalldata'
import { parseAbi } from '../lib/parseAbi'

type Decoded = string | BigNumber

export default function CalldataDecoder() {
  const [rawAbi, setRawAbi] = useState(`[
	{
		"inputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "parameter1",
								"type": "uint256"
							},
							{
								"components": [
									{
										"internalType": "uint256",
										"name": "parameter1",
										"type": "uint256"
									}
								],
								"internalType": "struct MyStruct1",
								"name": "parameter2",
								"type": "tuple"
							}
						],
						"internalType": "struct MyStruct2",
						"name": "parameter3",
						"type": "tuple"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "parameter1",
								"type": "uint256"
							},
							{
								"components": [
									{
										"internalType": "uint256",
										"name": "parameter1",
										"type": "uint256"
									}
								],
								"internalType": "struct MyStruct1",
								"name": "parameter2",
								"type": "tuple"
							}
						],
						"internalType": "struct MyStruct2",
						"name": "parameter4",
						"type": "tuple"
					}
				],
				"internalType": "struct MyType2",
				"name": "myType",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "myUint",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]`)

  const [encodedCalldata, setEncodedCalldata] = useState(
    '0x6a947f74000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000021c',
  )
  const [decoded, setDecoded] = useState<readonly unknown[]>()
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

  function fmtStrLength(word: string) {
    return word.slice(0, 10) + ' ... ' + word.slice(-10)
  }

  function isBaseType(type: string) {
    return (
      type.includes('bool') ||
      type.includes('int') ||
      type.includes('uint') ||
      type.includes('string') ||
      type.includes('address') ||
      type.includes('byte')
    )
  }

  function fmtDecoded(decoded: Decoded): JSX.Element {
    return (
      <code className="break-all" data-testid="decoded">
        {typeof decoded === 'string' ? fmtStrLength(decoded) : (decoded as BigNumber)._hex}
      </code>
    )
  }

  function f(decoded: Decoded | undefined): void {
    // console.log(decoded)
  }

  function fmtIfNested(param: ParamType, decodedParam: Decoded[] | string, colorSet: [number, number] = [300, 200]) {
    if (param.baseType === 'tuple') {
      return (
        <div className={`rounded-xl border-l-2 border-gray-${colorSet[1]} bg-gray-${colorSet[0]} p-3 pl-4`}>
          {zip(param.components, decodedParam).map(([c, d], i) => (
            <div className="flex gap-4" key={i}>
              {/* {fmtDecoded((d as Decoded[])[i])} */}

              {f(d)}

              {c?.baseType === 'tuple' ? (
                <section>
                  <code className="font-bold"> {c.name} </code>
                  <code className="mb-1"> {c.type !== 'tuple' && c.type} </code>
                  {fmtIfNested(c, '', [colorSet[0] + 100, colorSet[1] + 200])}
                </section>
              ) : (
                <section>
                  <code className="font-bold"> {c?.name} </code>
                  <code> {c?.type} </code>
                </section>
              )}
            </div>
          ))}
        </div>
      )
    } else if (param.baseType === 'array') {
      return (
        <code className="flex items-center rounded-xl border border-gray-300 bg-gray-100 p-2">
          <div> {param.type} </div>
          <div> {param.arrayChildren.baseType === 'array' && param.arrayChildren.type} </div>
        </code>
      )
    } else if (isBaseType(param.baseType)) {
      return <code className="flex items-center rounded-xl border border-gray-300 bg-gray-100 p-2">{param.type}</code>
    } else {
      return <code> unknown type </code>
    }
  }

  function fmtData(param: ParamType, decodedParam: Decoded[]): JSX.Element {
    // console.log(decodedParam)
    // console.log(param)
    // console.log(decodedParam)

    // convert it here
    if (Array.isArray(decodedParam)) {
      // console.log(decodedParam)
      //
      // console.log(param)
      // console.log(param.components)
      // console.log(toObject(decodedParam))
      if (param.components.length > 0) {
      }
    }

    return (
      <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-100 p-3 align-top font-semibold">
        <p className="font-bold">
          {(param as ParamType).name ? (
            (param as ParamType).name + '  '
          ) : (
            <p className="text-sm text-gray-500"> Name missing in ABI </p>
          )}
        </p>
        <section data-testid="inputParam"> {fmtIfNested(param, decodedParam)} </section>
      </div>
    )
  }

  return (
    <div className="ml-64 mt-32 flex flex-col gap-10">
      {/* <h1> Calldata decoder </h1>

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
          <label
            htmlFor="abi"
            className="flex-1 cursor-pointer border-r-2  p-4 text-center hover:bg-black hover:text-white"
          >
            Human-readable ABI
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

      <section className="relative mb-16 rounded-xl border border-gray-400 bg-gray-50 p-8" placeholder="Output">
        <section className="flex flex-col gap-3">
          <div className="flex gap-3 pb-2" data-testid="sigHash">
            <p className="pl-1 font-semibold"> {sigHash && 'Signature hash '} </p>
            <code> {sigHash} </code>
          </div>

          {zip(decoded, inputs).map((tupl, i) => {
            return (
              <section key={i}>
                <div className="flex items-center gap-3 font-semibold">
                  <div>{fmtData(tupl[1] as ParamType, tupl[0] as Decoded[])}</div>
                </div>
              </section>
            )
          })}
        </section>
      </section> */}
    </div>
  )
}
