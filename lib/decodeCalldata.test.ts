import { expect } from 'earljs'

import { decodeCalldata } from './decodeCalldata'
import { parseAbi } from './parseAbi'

describe(decodeCalldata.name, () => {
  it('handles expected case', () => {
    const iface = parseAbi('function transferFrom(address,address,uint256),')!
    expect(iface).toBeDefined()
    expect(
      decodeCalldata(
        iface,
        '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      ),
    ).toBeAnObjectWith({ decoded: expect.defined(), fragment: expect.defined() })
  })

  it('handles expected case from abi with multiple fragments', () => {
    const iface = parseAbi(`
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)',`)!
    expect(iface).toBeDefined()
    expect(
      decodeCalldata(
        iface,
        '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      ),
    ).toBeAnObjectWith({ decoded: expect.defined(), fragment: expect.defined() })
  })

  it('handles expected case, but calldata is not found', () => {
    const iface = parseAbi('function transferFrom(address,address,uint256)')!
    expect(iface).toBeDefined()
    expect(decodeCalldata(iface, '0x0')).not.toBeDefined()
  })
})
