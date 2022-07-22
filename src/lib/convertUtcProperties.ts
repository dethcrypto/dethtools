export const utcUnits = ['sec', 'min', 'hr', 'day', 'mon', 'year'] as const;

export interface UtcUnits {
  year: string;
  mon: string;
  day: string;
  hr: string;
  min: string;
  sec: string;
}

export type UtcUnit = keyof UtcUnits;
