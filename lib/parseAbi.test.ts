import { Interface } from '@ethersproject/abi'
import { expect } from 'earljs'

import { lastOne, parseAbi } from './parseAbi'
describe(lastOne.name, () => {
  it('gets last one correctly', () => {
    expect(lastOne([1, 2, 3])).toEqual(3)
    expect(lastOne(['alpha', 'beta', 'gamma'])).toEqual('gamma')
    expect(lastOne(['alpha'])).toEqual('alpha')
  })
})

describe(parseAbi.name, () => {
  it('handles expected case', () => {
    const abi = `
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)'
    `
    const iface = parseAbi(abi)!
    expect(iface).toBeA(Interface)

    const fragments = iface.fragments

    /// @todo - make these expect more elegant by comparing whole obj. instead of single params

    expect(fragments[0]).toBeAnObjectWith({ type: 'constructor' })

    expect(fragments[1]).toBeAnObjectWith({ inputs: expect.defined() })
    expect(fragments[2]).toBeAnObjectWith({ outputs: expect.defined() })
  })

  it('handles one-liner', () => {
    const abi = `
      'function transferFrom(address from, address to, uint256 amount)',
    `

    const iface = parseAbi(abi)!

    expect(iface).toBeA(Interface)
  })

  it('handles trailing comma case correctly', () => {
    const abi = `
      'constructor(string symbol, string name)',
      'event Transfer(address indexed from, address indexed to, uint256 amount)',
      'error AccountLocked(address owner, uint256 balance)',
    `

    const iface = parseAbi(abi)!

    expect(iface).toBeA(Interface)
  })

  it('handles trailing comma one-liner correctly', () => {
    const abi = `
      'constructor(string symbol, string name)',
    `

    const iface = parseAbi(abi)!

    expect(iface).toBeA(Interface)
  })

  it('handles expected case with event and error', () => {
    const abi = `
      'constructor(string symbol, string name)',
      'event Transfer(address indexed from, address indexed to, uint256 amount)',
      'error AccountLocked(address owner, uint256 balance)'
    `

    const iface = parseAbi(abi)!
    expect(iface).toBeA(Interface)

    const fragments = iface.fragments

    expect(fragments[0].type).toEqual('constructor')

    expect(fragments[1].type).toEqual('event')
    expect(fragments[1].name).toEqual('Transfer')

    expect(fragments[2].type).toEqual('error')
    expect(fragments[2].name).toEqual('AccountLocked')
  })

  it('handles case with messed up text format', () => {
    const abi = `
              '  constructor (string symbol,  string name)   ',
      'event        Transfer(address indexed from, address indexed to, uint256 amount)','error  AccountLocked      (address   owner, uint256 balance)'
    `
    const iface = parseAbi(abi)!
    expect(iface).toBeA(Interface)

    const fragments = iface.fragments

    expect(fragments[0].type).toEqual('constructor')

    expect(fragments[1].type).toEqual('event')
    expect(fragments[1].name).toEqual('Transfer')

    expect(fragments[2].type).toEqual('error')
    expect(fragments[2].name).toEqual('AccountLocked')
  })

  it('fails on wrong abi format (only "" format should be accepted)', () => {
    expect(() =>
      parseAbi(`
      "constructor(string symbol, string name)",
      "event Transfer(address indexed from, address indexed to, uint256 amount)",
      "error AccountLocked(address owner, uint256 balance)"
    `),
    ).toThrow()
  })
})
