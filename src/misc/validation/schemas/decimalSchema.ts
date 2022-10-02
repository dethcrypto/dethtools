import { z } from 'zod';

export const decimalSchema = z.number().or(
  z
    .string()
    .regex(/^\d*$/, {
      message: 'The value must be a decimal number',
    })
    .transform(Number),
);
