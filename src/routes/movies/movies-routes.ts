import { z } from 'zod'

import type { MyMediaPlugin } from '../../types/index.js'
import type { Media } from '../omdb/omdb-schemas.js'
import config from '../../config.js'

import { createMovieSchema, movieOutputSchema, populatedMovieOutputSchema } from './movies-schemas.js'

const moviesRoutes: MyMediaPlugin = async function moviesRoutes (app) {
  app.addHook('preHandler', app.authenticate)

  app.post('', {
    schema: {
      body: z.object({ imdbID: z.string() }),
      response: {
        200: createMovieSchema.extend({ id: z.number().int() }),
      },
    },
    handler: async (req, reply) => {
      const imdbID = req.body.imdbID
      const { Title, Year, Poster } = await fetch(config.omdbIdUrl + imdbID).then(res => res.json()) as Media
      const movie: z.infer<typeof createMovieSchema> = { title: Title, year: +Year, poster: Poster, imdbID }
      const savedMovie = await app.prisma.movie.create({ data: movie })
      reply.status(201)
      return savedMovie
    },
  })

  app.get('', {
    schema: {
      response: {
        200: z.array(movieOutputSchema),
      },
    },
    handler: async () => {
      const movies = await app.prisma.movie.findMany({})
      return movies
    },
  })

  app.delete('/:id/labels/:labelId', {
    schema: {
      params: z.object({ id: z.string(), labelId: z.string() }),
      response: {
        200: z.object({
          status: z.number().int().positive(),
          message: z.string(),
        }),
        404: z.object({
          status: z.number().int().positive().min(400).max(499),
          message: z.string(),
        }),
      },
    },
    handler: async (req, reply) => {
      const movieId = +req.params.id
      const labelId = +req.params.labelId
      const movie = await app.prisma.movie.findUnique({ where: { id: movieId } })
      if (!movie) {
        reply.status(404)
        return {
          status: 404,
          message: 'No movie with that id',
        }
      }

      await app.prisma.movieLabel.delete({ where: { movie_label: { labelId, movieId } } })

      return {
        status: 200,
        message: 'Label removed from the movie',
      }
    },
  })

  app.post('/:id/labels', {
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        name: z.string(),
      }),
      response: {
        200: z.object({
          movieId: z.number().int().positive(),
          labelId: z.number().int().positive(),
        }),
        404: z.object({
          status: z.number().int().positive().min(400).max(499),
          message: z.string(),
        }),
      },
    },
    handler: async (req, reply) => {
      const movieId = +req.params.id
      const movie = await app.prisma.movie.findUnique({ where: { id: movieId } })
      if (!movie) {
        reply.status(404)
        return {
          status: 404,
          message: 'No movie with that id',
        }
      }

      const name = req.body.name
      const label = await app.prisma.label.upsert({ where: { name }, create: { name }, update: {} })

      const updatedMovie = await app.prisma.movieLabel.create({
        data: {
          labelId: label.id,
          movieId,
        },
      })
      return updatedMovie
    },
  })

  app.get('/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: movieOutputSchema.extend({
          labels: z.array(populatedMovieOutputSchema),
        }),
        404: z.object({
          status: z.number().int().positive().min(400).max(499),
          message: z.string(),
        }),
      },
    },
    handler: async (req, reply) => {
      const id = +req.params.id
      const movie = await app.prisma.movie.findUnique({
        where: { id },
        include: {
          labels: {
            include: {
              label: true,
            },
          },
        },
      })
      if (!movie) {
        reply.status(404)
        return {
          status: 404,
          message: 'No movie with that id',
        }
      }
      return movie
    },
  })
}

export default moviesRoutes
