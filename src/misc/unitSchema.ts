import { z } from 'zod';

export const unitSchema = z.preprocess(
  (value) => String(value).trim(),
  z
    .string()
    .regex(/^[.0-9]*$/, {
      message:
        "The value mustn't contain letters or any special signs except dot",
    })
    .min(1, { message: 'The value must be bigger or equal to 1' })
    .max(26, { message: 'The value must be less or equal to 26' }),
);
