import { z } from 'zod';

export const unitSchema = z.preprocess(
  (value) => String(value).trim(),
  z
    .string()
    .regex(/^[.0-9]*$/, {
      message:
        "The value mustn't contain letters or any special signs except dot",
    })
    .min(1, { message: 'The value must be longer than 1 digit' }),
);
