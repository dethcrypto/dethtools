import { z } from 'zod';

export const decimalSchema = z
  .number()
  .or(
    z
      .string()
      .regex(/^\d*$/, {
        message:
          'The value must be a hexadecimal number, 0x-prefix is required',
      })
      .transform(Number),
  )
  .refine((n) => n >= 0 && n <= 128);
