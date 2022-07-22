import { z } from 'zod';

export const unixEpochSchema = z
  .string()
  .regex(/^[.0-9]*$/, {
    message: "The value mustn't contain letters or any special signs",
  })
  .min(1, { message: `The value length must be more than 1` });
