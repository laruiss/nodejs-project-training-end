import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'The email should be a valid email' }),
  password: z.string(),
})

export const passwordResetSchema = z.object({
  email: z.string().email({ message: 'The email should be a valid email' }),
})
