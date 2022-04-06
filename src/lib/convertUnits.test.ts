import { expect } from 'earljs';

import { convertEthUnits, unitPrecisionToValue } from './convertUnits';

describe('unitPrecisionToValue', () => {
  it('productes accurate values', () => {
    expect(unitPrecisionToValue(-1)).toEqual('0');
    expect(unitPrecisionToValue(0)).toEqual('1');
    expect(unitPrecisionToValue(1)).toEqual('10');
    expect(unitPrecisionToValue(9)).toEqual('1000000000');
    expect(unitPrecisionToValue(18)).toEqual('1000000000000000000');
  });
});

describe('convertEthUnits', () => {
  it('performs common conversion', () => {
    expect(convertEthUnits('12', 'wei', 'wei')).toEqual('12');
    expect(convertEthUnits('12', 'wei', 'gwei')).toEqual('0.000000012');
    expect(convertEthUnits('12', 'wei', 'eth')).toEqual('0.000000000000000012');

    expect(convertEthUnits('12', 'gwei', 'gwei')).toEqual('12');
    expect(convertEthUnits('12', 'gwei', 'wei')).toEqual('12000000000');
    expect(convertEthUnits('12', 'gwei', 'eth')).toEqual('0.000000012');

    expect(convertEthUnits('12', 'eth', 'eth')).toEqual('12');
    expect(convertEthUnits('12', 'eth', 'gwei')).toEqual('12000000000');
    expect(convertEthUnits('12', 'eth', 'wei')).toEqual('12000000000000000000');
  });

  it.skip('performs tiny unit conversion', () => {
    expect(
      convertEthUnits('0.000000000000000030043311111001', 'eth', 'gwei'),
    ).toEqual('0.00000003');
    expect(
      convertEthUnits('0.000000000000000030043311111001', 'eth', 'wei'),
    ).toEqual('30');
  });

  it.skip('performs lossy conversion ', () => {
    // @notice it fails, as currently we're not expecting decimals in such case
    expect(convertEthUnits('0.00000412300033333300012', 'gwei', 'wei')).toEqual(
      '4123',
    );
    expect(convertEthUnits('12', 'gwei', 'eth')).toEqual(
      '0.000000000000004123',
    );
  });

  it('performs untypical conversion', () => {
    expect(convertEthUnits('0.12', 'wei', 'eth')).toEqual(
      '0.00000000000000000012',
    );
  });
});
