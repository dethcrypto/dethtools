import { z } from 'zod';

export const binarySchema = z.string().regex(/\b[01]+\b/, {
  message: 'The value must be a valid, binary number',
});
