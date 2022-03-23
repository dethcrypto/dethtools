import { z } from 'zod'

const LARGEST_DECIMAL = 26

export const decimalSchema = z.preprocess(
  (value) => parseInt(String(value)),
  z
    .number()
    .gte(0, { message: 'The decimal value must be bigger or equal to 0' })
    .lte(LARGEST_DECIMAL, {
      message: `The decimal value must be smaller or equal to ${LARGEST_DECIMAL}`,
    }),
)
