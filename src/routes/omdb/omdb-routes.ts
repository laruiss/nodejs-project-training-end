import { z } from 'zod'

import type { MyMediaPlugin } from '../../types/index.js'
import config from '../../config.js'

import type { Media, OmdbSearchResponse } from './omdb-schemas.js'
import { omdbMediaSchema, omdbSearchResponseSchema } from './omdb-schemas.js'

const omdbRoutes: MyMediaPlugin = async function omdbRoutes (app) {
  app.addHook('preHandler', app.authenticate)

  app.get('/media', {
    schema: {
      querystring: z.object({ s: z.string() }),
      response: {
        200: omdbSearchResponseSchema,
      },
    },
    handler: async (req, reply) => {
      const search = req.query.s
      // Create the url to make the request to
      const body = await fetch(config.omdbSearchUrl + search).then(res => res.json()) as OmdbSearchResponse
      reply.status(200)
      return body
    },
  })

  // http://localhost/media/123
  app.get('/media/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: omdbMediaSchema,
      },
    },
    handler: async (req) => {
      const id = req.params.id
      // Create the url to make the request to
      const body = await fetch(config.omdbIdUrl + id).then(res => res.json()) as Media

      return body // By default, fastify sends the 200 status code
    },
  })
}

export default omdbRoutes
