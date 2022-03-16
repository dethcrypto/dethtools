import { z } from 'zod'

export const unitSchema = z.preprocess(
  (value) => String(value).trim(),
  z
    .string()
    .regex(/^[.0-9]*$/, { message: "The value mustn't contain letters" })
    .min(1, { message: 'The value must be minimum 1 numbers long' })
    .max(26, { message: 'The value must be maximum 26 numbers long' }),
)
