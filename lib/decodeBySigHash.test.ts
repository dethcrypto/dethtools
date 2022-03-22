import { BigNumber } from '@ethersproject/bignumber'
import { expect } from 'earljs'

import { decodeBySigHash, decodeData, fetchData, parseData } from './decodeBySigHash'

describe(fetchData.name, () => {
  it('fetches correct data by signature', async () => {
    expect(await fetchData('0x23b872dd')).toEqual([
      {
        id: 31781,
        created_at: '2018-05-12T20:40:45.467194Z',
        text_signature: 'gasprice_bit_ether(int128)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
      {
        id: 147,
        created_at: '2016-07-09T03:58:28.927638Z',
        text_signature: 'transferFrom(address,address,uint256)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
    ])
  })
})

describe(parseData.name, () => {
  it('parses fetched results to interface format', () => {
    const ifaces = parseData([
      {
        id: 31781,
        created_at: '2018-05-12T20:40:45.467194Z',
        text_signature: 'gasprice_bit_ether(int128)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
      {
        id: 147,
        created_at: '2016-07-09T03:58:28.927638Z',
        text_signature: 'transferFrom(address,address,uint256)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
    ])
    const gasPriceParams = ['int128']
    const transferFromParams = ['address', 'address', 'uint256']

    expect(ifaces.length).toEqual(2)
    expect(ifaces[0].fragments[0].name).toEqual('gasprice_bit_ether')
    expect(ifaces[1].fragments[0].name).toEqual('transferFrom')
    ifaces[0].fragments[0].inputs.forEach((param, i) => {
      expect(param.type).toEqual(gasPriceParams[i])
    })
    ifaces[1].fragments[0].inputs.forEach((param, i) => {
      expect(param.type).toEqual(transferFromParams[i])
    })
  })
})

describe(decodeData.name, () => {
  it('decodes interfaces', () => {
    const ifaces = parseData([
      {
        id: 31781,
        created_at: '2018-05-12T20:40:45.467194Z',
        text_signature: 'gasprice_bit_ether(int128)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
      {
        id: 147,
        created_at: '2016-07-09T03:58:28.927638Z',
        text_signature: 'transferFrom(address,address,uint256)',
        hex_signature: '0x23b872dd',
        bytes_signature: '#¸rÝ',
      },
    ])
    const decodedResults = decodeData(
      ifaces,
      '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    )

    expect((decodedResults[0].decoded[0] as BigNumber)._hex).toEqual('0x551bd432803012645ac136ddd64dba72')
    expect(decodedResults[0].fragment.name).toEqual('gasprice_bit_ether')
    expect(decodedResults[0].sigHash).toEqual('0x23b872dd')
    expect(decodedResults[1].decoded[0] as string).toEqual('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
    expect(decodedResults[1].decoded[1] as string).toEqual('0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C')
    expect((decodedResults[1].decoded[2] as BigNumber)._hex).toEqual('0x0de0b6b3a7640000')
    expect(decodedResults[1].fragment.name).toEqual('transferFrom')
    expect(decodedResults[1].sigHash).toEqual('0x23b872dd')
  })

  describe(decodeBySigHash.name, async () => {
    it('decodes calldata by 4 byte hash signature and returns matches', async () => {
      const decodedResults = await decodeBySigHash(
        '0x23b872dd',
        '0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      )

      expect(decodedResults).toBeDefined()
      expect((decodedResults![0].decoded[0] as BigNumber)._hex).toEqual('0x551bd432803012645ac136ddd64dba72')
      expect(decodedResults![0].fragment.name).toEqual('gasprice_bit_ether')
      expect(decodedResults![0].sigHash).toEqual('0x23b872dd')
      expect(decodedResults![1].decoded[0] as string).toEqual('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
      expect(decodedResults![1].decoded[1] as string).toEqual('0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C')
      expect((decodedResults![1].decoded[2] as BigNumber)._hex).toEqual('0x0de0b6b3a7640000')
      expect(decodedResults![1].fragment.name).toEqual('transferFrom')
      expect(decodedResults![1].sigHash).toEqual('0x23b872dd')
    })
  })
})
