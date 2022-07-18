import { z } from 'zod';

export const octalSchema = z
  .string()
  .regex(/^0[1-7][0-7]*$/, {
    message: 'The value must be a valid, octal number, 0-prefix is required',
  })
  .min(2, { message: 'The value must be longer than 2 digit' });
