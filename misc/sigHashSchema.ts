import { z } from 'zod'

export const sigHashSchema = z.string().regex(/0[xX][0-9a-fA-F]+/)
