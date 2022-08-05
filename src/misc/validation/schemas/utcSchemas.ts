import { z, ZodNumber } from 'zod';

import { UtcUnit } from '../../../lib/convertUtcProperties';

// @internal
const utcSchemas = {
  secondSchema: utcSchema(59, 1),
  minuteSchema: utcSchema(59, 1),
  hourSchema: utcSchema(23, 0),
  daySchema: utcSchema(31, 1),
  monthSchema: utcSchema(12, 1),
  yearSchema: utcSchema(9999, 1970),
};

export const utcUnitToZodSchema: Record<UtcUnit, ZodNumber> = {
  sec: utcSchemas.secondSchema,
  min: utcSchemas.minuteSchema,
  hr: utcSchemas.hourSchema,
  day: utcSchemas.daySchema,
  mon: utcSchemas.monthSchema,
  year: utcSchemas.yearSchema,
};

// @internal
function utcSchema(max: number, min: number = 0): ZodNumber {
  return z
    .preprocess((value) => Number.parseInt(value as string), z.number())
    .innerType()
    .lte(max, { message: `The value must be a number less than ${max}` })
    .gte(min, { message: `The value must be a number greater than ${min}` });
}
