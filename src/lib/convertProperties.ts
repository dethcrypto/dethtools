import { PrecisionDict } from './convertUnits';

export const unitPrecision: PrecisionDict<UnitType> = {
  wei: 1,
  gwei: 9,
  eth: 18,
};

export type UnitType = 'wei' | 'gwei' | 'eth';

const unitTypes: UnitType[] = ['wei', 'gwei', 'eth'];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UnitType = { values: unitTypes };

export const tokenPrecision: PrecisionDict<TokenUnitType> = {
  unit: 1,
  base: 18,
};

export type TokenUnitType = 'unit' | 'base';
