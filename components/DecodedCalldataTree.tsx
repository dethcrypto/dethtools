import { Fragment, ParamType } from '@ethersproject/abi'

import { decodeCalldata, Decoded } from '../lib/decodeCalldata'
import { parseAbi } from '../lib/parseAbi'

const TEMP_ABI = `[
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
]`

const TEMP_CALLDATA =
  '0x6a947f74000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000021c'

const decodingResult = decodeCalldata(parseAbi(TEMP_ABI), TEMP_CALLDATA)!

interface Node {
  name: ParamType['name']
  type: ParamType['type']
}

interface Leaf extends Node {
  value: string
  components?: never
}

interface DeepNode extends Node {
  components: Array<Leaf | Tree>
  value?: never
}

type Tree = Leaf | DeepNode

function attachValues(components: ParamType[], decoded: Decoded): Tree[] {
  return components.map((input, index): Tree => {
    if (input.type === 'tuple') {
      const value = decoded[index]

      if (!Array.isArray(value)) {
        throw new Error('input.type is tuple, but decoded value is not an array')
      }

      const { components } = input

      return {
        name: input.name,
        type: input.type,
        components: attachValues(components, value),
      }
    }

    return {
      name: input.name,
      type: input.type,
      value: String(decoded[index]),
    }
  })
}

export function DecodedCalldataTree() {
  const value = attachValues(decodingResult.fragment.inputs, decodingResult.decoded)

  return (
    <output>
      <pre style={{ fontSize: '0.8em' }}>{JSON.stringify(value, null, 2)}</pre>
    </output>
  )
}
