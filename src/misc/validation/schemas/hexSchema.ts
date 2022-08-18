import { z } from 'zod';

export const hexSchema = z
  .string()
  .regex(/^0[xX][0-9a-fA-F]+$/, {
    message: 'The value must be a hexadecimal number, 0x-prefix is required',
  })
  .min(2, { message: 'The value must be longer than 2 digit' });

export const hexSchemaWithoutPrefix = z.string().regex(/^[0-9a-fA-F]+$/, {
  message:
    'The value must be a hexadecimal number, 0x-prefix is added automatically',
});
