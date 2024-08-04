import { z } from 'zod'
import type {
  FastifyPluginAsync,
  FastifyPluginOptions,
  RawServerBase,
} from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export type MyMediaPlugin = FastifyPluginAsync<FastifyPluginOptions, RawServerBase, ZodTypeProvider>

export const errorResponseBodySchema = z.object({
  status: z.number().min(400).max(599),
  message: z.string(),
})

export type ErrorResponseBody = z.infer<typeof errorResponseBodySchema>
