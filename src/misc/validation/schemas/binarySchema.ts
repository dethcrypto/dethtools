import { z } from 'zod';

export const binarySchema = z.string().regex(/^[01]*$/, {
  message: 'The value must be a valid, binary number',
});
