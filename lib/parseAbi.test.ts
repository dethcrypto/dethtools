import { Interface } from '@ethersproject/abi';
import { expect } from 'earljs';

import { findKeyword, lastOne, parseAbi } from './parseAbi';

describe(findKeyword.name, () => {
  it('finds keywords correctly', () => {
    expect(findKeyword('function transferFrom()')).toEqual(true);
    expect(findKeyword('error NotPermitted()')).toEqual(true);
    expect(findKeyword('event FundsSent()')).toEqual(true);
    expect(findKeyword('NotPermitted()')).toEqual(false);
    expect(findKeyword('receive()')).toEqual(true);
    expect(findKeyword('constructor()')).toEqual(true);
    expect(findKeyword('eventreceive()')).toEqual(false);
  });

  it.skip('finds keyword in edge cases correctly', () => {
    expect(findKeyword('function_transferFrom()')).toEqual(false);
  });
});

describe(lastOne.name, () => {
  it('gets last one correctly', () => {
    expect(lastOne([1, 2, 3])).toEqual(3);
    expect(lastOne(['alpha', 'beta', 'gamma'])).toEqual('gamma');
    expect(lastOne(['alpha'])).toEqual('alpha');
  });
});

describe(parseAbi.name, () => {
  it('handles expected case', () => {
    const abi = `
      'constructor(string symbol, string name)',
      'function transferFrom(address from, address to, uint256 amount)',
      'function getUser(uint256 id) view returns (tuple(string name, address addr) user)'
    `;
    const iface = parseAbi(abi)! as Interface;
    expect(iface).toBeA(Interface);

    const fragments = iface.fragments;

    expect(fragments[0]).toBeAnObjectWith({ type: 'constructor' });

    expect(fragments[1]).toBeAnObjectWith({ inputs: expect.defined() });
    expect(fragments[2]).toBeAnObjectWith({ outputs: expect.defined() });
  });

  it('handles one-liner', () => {
    const abi = `
      'function transferFrom(address from, address to, uint256 amount)',
    `;

    const iface = parseAbi(abi)!;

    expect(iface).toBeA(Interface);
  });

  it('handles trailing comma case correctly', () => {
    const abi = `
      'constructor(string symbol, string name)',
      'event Transfer(address indexed from, address indexed to, uint256 amount)',
      'error AccountLocked(address owner, uint256 balance)',
    `;

    const iface = parseAbi(abi)!;

    expect(iface).toBeA(Interface);
  });

  it('handles trailing comma one-liner correctly', () => {
    const abi = `
      'constructor(string symbol, string name)',
    `;

    const iface = parseAbi(abi)!;

    expect(iface).toBeA(Interface);
  });

  it('handles expected case with event and error', () => {
    const abi = `
      'constructor(string symbol, string name)',
      'event Transfer(address indexed from, address indexed to, uint256 amount)',
      'error AccountLocked(address owner, uint256 balance)'
    `;

    const iface = parseAbi(abi)! as Interface;
    expect(iface).toBeA(Interface);

    const fragments = iface.fragments;

    expect(fragments[0].type).toEqual('constructor');
    expect(fragments[1].type).toEqual('event');
    expect(fragments[1].name).toEqual('Transfer');
    expect(fragments[2].type).toEqual('error');
    expect(fragments[2].name).toEqual('AccountLocked');
  });

  it('handles case with messed up text format', () => {
    const abi = `
              '  constructor (string symbol,  string name)   ',
      'event        Transfer(address indexed from, address indexed to, uint256 amount)','error  AccountLocked      (address   owner, uint256 balance)'
    `;

    const iface = parseAbi(abi)! as Interface;

    expect(iface).toBeA(Interface);

    const fragments = iface.fragments;

    expect(fragments[0].type).toEqual('constructor');
    expect(fragments[1].type).toEqual('event');
    expect(fragments[1].name).toEqual('Transfer');
    expect(fragments[2].type).toEqual('error');
    expect(fragments[2].name).toEqual('AccountLocked');
  });

  it('fails on wrong abi format (only "" format should be accepted)', () => {
    expect(() =>
      parseAbi(`
      "constructor(string symbol, string name)",
      "event Transfer(address indexed from, address indexed to, uint256 amount)",
      "error AccountLocked(address owner, uint256 balance)"
    `),
    ).toThrow();
  });

  it('handle human-readable cases without keywords', () => {
    const abi = `
      'constructor(string symbol, string name)',
      'AccountLocked(address owner, uint256 balance)',
      'transferFrom(address indexed from, address to, uint256 amount)',
      'getUser(uint256 id) view returns (tuple(string name, address addr) user)',
    `;

    const iface = parseAbi(abi)! as Interface;

    expect(iface).toBeA(Interface);
  });

  it('parses abi in json format', () => {
    const parsed = parseAbi(`
      [{"inputs":[{"internalType":"address","name":"wormholeJoin_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usr","type":"address"}],"name":"Deny","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"data","type":"uint256"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usr","type":"address"}],"name":"Rely","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"signers","type":"address[]"}],"name":"SignersAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"signers","type":"address[]"}],"name":"SignersRemoved","type":"event"},{"inputs":[{"internalType":"address[]","name":"signers_","type":"address[]"}],"name":"addSigners","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"deny","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32","name":"sourceDomain","type":"bytes32"},{"internalType":"bytes32","name":"targetDomain","type":"bytes32"},{"internalType":"bytes32","name":"receiver","type":"bytes32"},{"internalType":"bytes32","name":"operator","type":"bytes32"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint80","name":"nonce","type":"uint80"},{"internalType":"uint48","name":"timestamp","type":"uint48"}],"internalType":"struct WormholeGUID","name":"wormholeGUID","type":"tuple"}],"name":"getSignHash","outputs":[{"internalType":"bytes32","name":"signHash","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"signHash","type":"bytes32"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"threshold_","type":"uint256"}],"name":"isValid","outputs":[{"internalType":"bool","name":"valid","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"rely","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"signers_","type":"address[]"}],"name":"removeSigners","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32","name":"sourceDomain","type":"bytes32"},{"internalType":"bytes32","name":"targetDomain","type":"bytes32"},{"internalType":"bytes32","name":"receiver","type":"bytes32"},{"internalType":"bytes32","name":"operator","type":"bytes32"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint80","name":"nonce","type":"uint80"},{"internalType":"uint48","name":"timestamp","type":"uint48"}],"internalType":"struct WormholeGUID","name":"wormholeGUID","type":"tuple"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"maxFeePercentage","type":"uint256"},{"internalType":"uint256","name":"operatorFee","type":"uint256"}],"name":"requestMint","outputs":[{"internalType":"uint256","name":"postFeeAmount","type":"uint256"},{"internalType":"uint256","name":"totalFee","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"threshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wormholeJoin","outputs":[{"internalType":"contract WormholeJoinLike_1","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
    `) as Interface;

    expect(parsed).toBeA(Interface);
    expect(parsed.fragments[0].type).toEqual('constructor');
    expect(parsed.fragments[1].type).toEqual('event');
    expect(parsed.fragments[1].name).toEqual('Deny');
    expect(parsed.fragments[2].type).toEqual('event');
    expect(parsed.fragments[2].name).toEqual('File');
  });

  it('parses abi in json format', () => {
    const parsed = parseAbi(`
      [{"inputs":[{"internalType":"address","name":"wormholeJoin_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usr","type":"address"}],"name":"Deny","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"data","type":"uint256"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usr","type":"address"}],"name":"Rely","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"signers","type":"address[]"}],"name":"SignersAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"signers","type":"address[]"}],"name":"SignersRemoved","type":"event"},{"inputs":[{"internalType":"address[]","name":"signers_","type":"address[]"}],"name":"addSigners","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"deny","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32","name":"sourceDomain","type":"bytes32"},{"internalType":"bytes32","name":"targetDomain","type":"bytes32"},{"internalType":"bytes32","name":"receiver","type":"bytes32"},{"internalType":"bytes32","name":"operator","type":"bytes32"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint80","name":"nonce","type":"uint80"},{"internalType":"uint48","name":"timestamp","type":"uint48"}],"internalType":"struct WormholeGUID","name":"wormholeGUID","type":"tuple"}],"name":"getSignHash","outputs":[{"internalType":"bytes32","name":"signHash","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"signHash","type":"bytes32"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"threshold_","type":"uint256"}],"name":"isValid","outputs":[{"internalType":"bool","name":"valid","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"rely","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"signers_","type":"address[]"}],"name":"removeSigners","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32","name":"sourceDomain","type":"bytes32"},{"internalType":"bytes32","name":"targetDomain","type":"bytes32"},{"internalType":"bytes32","name":"receiver","type":"bytes32"},{"internalType":"bytes32","name":"operator","type":"bytes32"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint80","name":"nonce","type":"uint80"},{"internalType":"uint48","name":"timestamp","type":"uint48"}],"internalType":"struct WormholeGUID","name":"wormholeGUID","type":"tuple"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"maxFeePercentage","type":"uint256"},{"internalType":"uint256","name":"operatorFee","type":"uint256"}],"name":"requestMint","outputs":[{"internalType":"uint256","name":"postFeeAmount","type":"uint256"},{"internalType":"uint256","name":"totalFee","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"threshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wormholeJoin","outputs":[{"internalType":"contract WormholeJoinLike_1","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
    `) as Interface;

    expect(parsed).toBeA(Interface);
    expect(parsed.fragments[0].type).toEqual('constructor');
    expect(parsed.fragments[1].type).toEqual('event');
    expect(parsed.fragments[1].name).toEqual('Deny');
    expect(parsed.fragments[2].type).toEqual('event');
    expect(parsed.fragments[2].name).toEqual('File');
  });

  it('return error when json abi is flawed', () => {
    expect(() =>
      parseAbi(`
      [{"inputs":'internalType':"address","name":"wormholeJoin_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usr","type":"address"}],"name":"Deny","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"data","type":"uint256"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usr","type":"address"}],"name":"Rely","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"signers","type":"address[]"}],"name":"SignersAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address[]","name":"signers","type":"address[]"}],"name":"SignersRemoved","type":"event"},{"inputs":[{"internalType":"address[]","name":"signers_","type":"address[]"}],"name":"addSigners","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"deny","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32","name":"sourceDomain","type":"bytes32"},{"internalType":"bytes32","name":"targetDomain","type":"bytes32"},{"internalType":"bytes32","name":"receiver","type":"bytes32"},{"internalType":"bytes32","name":"operator","type":"bytes32"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint80","name":"nonce","type":"uint80"},{"internalType":"uint48","name":"timestamp","type":"uint48"}],"internalType":"struct WormholeGUID","name":"wormholeGUID","type":"tuple"}],"name":"getSignHash","outputs":[{"internalType":"bytes32","name":"signHash","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"signHash","type":"bytes32"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"threshold_","type":"uint256"}],"name":"isValid","outputs":[{"internalType":"bool","name":"valid","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"rely","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"signers_","type":"address[]"}],"name":"removeSigners","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32","name":"sourceDomain","type":"bytes32"},{"internalType":"bytes32","name":"targetDomain","type":"bytes32"},{"internalType":"bytes32","name":"receiver","type":"bytes32"},{"internalType":"bytes32","name":"operator","type":"bytes32"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"uint80","name":"nonce","type":"uint80"},{"internalType":"uint48","name":"timestamp","type":"uint48"}],"internalType":"struct WormholeGUID","name":"wormholeGUID","type":"tuple"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"maxFeePercentage","type":"uint256"},{"internalType":"uint256","name":"operatorFee","type":"uint256"}],"name":"requestMint","outputs":[{"internalType":"uint256","name":"postFeeAmount","type":"uint256"},{"internalType":"uint256","name":"totalFee","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"threshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wormholeJoin","outputs":[{"internalType":"contract WormholeJoinLike_1","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
    `),
    ).toThrow();
  });
});
