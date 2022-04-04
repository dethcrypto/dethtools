import { Interface } from '@ethersproject/abi';
import { expect } from 'earljs';

import { encodeConstructor } from './encodeContructor';
import { parseAbi } from './parseAbi';

describe(encodeConstructor.name, () => {
  it('encodes constructor parameters', () => {
    const iface = parseAbi(
      'constructor(address _base, address _prices, uint256 _minCommitmentAge, uint256 _maxCommitmentAge)',
    ) as Interface;
    const encoded = encodeConstructor(iface, [
      '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
      '0xb9d374d0fe3d8341155663fae31b7beae0ae233a',
      '60',
      '86400',
    ]);

    expect(encoded).toEqual(
      '0x00000000000000000000000057f1887a8bf19b14fc0df6fd9b2acc9af147ea85000000000000000000000000b9d374d0fe3d8341155663fae31b7beae0ae233a000000000000000000000000000000000000000000000000000000000000003c0000000000000000000000000000000000000000000000000000000000015180',
    );
  });
});
