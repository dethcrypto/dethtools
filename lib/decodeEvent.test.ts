import { EventFragment, FormatTypes, Interface } from '@ethersproject/abi'
import { expect } from 'earljs'

import { attachIndexedToJson, decodeEvent, doesContainNamedKeys, EventProps, filterNonNamedKeys } from './decodeEvent'
import { parseAbi } from './parseAbi'

describe(attachIndexedToJson.name, () => {
  it('attaches indexed modif. basing on topic count to json abi', () => {
    const iface = parseAbi(`
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',
      'event Transfer(address indexed src, address indexed dst, uint256 amount)',`) as Interface

    expect(iface).toBeA(Interface)

    const indexedIface = attachIndexedToJson(iface.format(FormatTypes.json), 2)

    expect(indexedIface).toBeA(Interface)

    expect(Object.entries(indexedIface.events)[0][1].inputs[0].indexed).toEqual(true)
    expect(Object.entries(indexedIface.events)[0][1].inputs[1].indexed).toEqual(true)
    expect(Object.entries(indexedIface.events)[0][1].inputs[2].indexed).toBeFalsy()
  })
})

describe(filterNonNamedKeys.name, () => {
  it('filters non named keys e.g 0, 1 correctly', () => {
    expect(filterNonNamedKeys({ '0': 'hello', 1: 'world!', dethTools: 'is', awesome: '8)' })).toEqual({
      dethTools: 'is',
      awesome: '8)',
    })
  })
})

describe(doesContainNamedKeys.name, () => {
  it('checks if object contains named keys', () => {
    expect(doesContainNamedKeys({ '0': 'hello', 1: 'world!', dethTools: 'is', awesome: '8)' })).toEqual(true)
    expect(doesContainNamedKeys({ '0': 'hello', 1: 'world!' })).toEqual(false)
  })
})

describe(decodeEvent.name, () => {
  it('handles expected case', () => {
    const iface = parseAbi(`
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',
      'event Transfer(address indexed src, address indexed dst, uint256 amount)',
      `) as Interface
    const eventProps: EventProps = {
      data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
        '0x000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c',
      ],
    }
    const decodeEventResult = decodeEvent(iface, eventProps)

    expect(decodeEventResult).toBeDefined()

    const { decodedTopics, eventFragment, isNamedResult } = decodeEventResult!

    expect(decodedTopics.src).toEqual('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
    expect(decodedTopics.dst).toEqual('0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C')
    expect(decodedTopics.amount._hex).toEqual('0x0de0b6b3a7640000')
    expect(eventFragment[1]).toBeA(EventFragment)
    expect(isNamedResult).toEqual(true)
  })

  it('handles case with too few topics', () => {
    const iface = parseAbi(`
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',
      'event Transfer(address indexed src, address indexed dst, uint256 amount)',
      `) as Interface
    const eventProps: EventProps = {
      data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
      ],
    }
    const decodeEventResult = decodeEvent(iface, eventProps)

    expect(decodeEventResult).toMatchSnapshot()
  })

  it('handles non-named params case', () => {
    const iface = parseAbi(`
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',
      'event Transfer(address indexed, address indexed, uint256)',
      `) as Interface
    const eventProps: EventProps = {
      data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
        '0x000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c',
      ],
    }
    const decodeEventResult = decodeEvent(iface, eventProps)

    const { isNamedResult } = decodeEventResult!

    expect(isNamedResult).toEqual(false)

    expect(decodeEventResult).toMatchSnapshot()
  })

  it('handles case where abi does not contain events', () => {
    const iface = parseAbi(`
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',
      `) as Interface
    const eventProps: EventProps = {
      data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
        '0x000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c',
      ],
    }
    const decodeEventResult = decodeEvent(iface, eventProps)

    expect(decodeEventResult).toMatchSnapshot()
  })
})
