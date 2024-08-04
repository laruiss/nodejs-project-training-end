import { z } from 'zod'

import type { MyMediaPlugin } from '../../types/index.js'

import { labelOutputSchema } from './labels-schemas.js'

const labelsRoutes: MyMediaPlugin = async function labelsRoutes (app) {
  app.post('', {
    schema: {
      body: z.object({ name: z.string() }),
      response: {
        200: z.object({ name: z.string(), id: z.number().int() }),
      },
    },
    handler: async (req) => {
      const name = req.body.name
      const label = await app.prisma.label.create({ data: { name } })
      return label
    },
  })

  app.get('/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: labelOutputSchema,
        404: z.object({
          status: z.number().int().positive().min(400).max(499),
          message: z.string(),
        }),
      },
    },
    handler: async (req, reply) => {
      const id = +req.params.id
      const label = await app.prisma.label.findUnique({ where: { id } })
      if (!label) {
        reply.status(404)
        return {
          status: 404,
          message: 'No label with that id',
        }
      }
      return label
    },
  })

  app.get('', {
    schema: {
      querystring: z.object({ q: z.string() }),
      response: {
        200: z.array(labelOutputSchema),
      },
    },
    handler: async (req) => {
      const q = req.query.q
      const labels = await app.prisma.label.findMany({
        where: {
          name: {
            contains: q,
          },
        },
      })
      return labels
    },
  })
}

export default labelsRoutes
