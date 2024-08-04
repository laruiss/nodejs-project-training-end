import { z } from 'zod'

export const createLabelSchema = z.object({
  name: z.string(),
})

export const labelOutputSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(200),
})