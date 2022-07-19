import { PrecisionDict } from './convertUnits';

export const unitPrecision: PrecisionDict<UnitType> = {
  wei: 0, // 1e0 === 1
  gwei: 9,
  eth: 18,
};

export type UnitType = 'wei' | 'gwei' | 'eth';

const unitTypes: UnitType[] = ['wei', 'gwei', 'eth'];

export const unitType = { values: unitTypes };

export type TokenUnitType = 'unit' | 'base';
