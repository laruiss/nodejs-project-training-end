import { z } from 'zod'

export const createMovieSchema = z.object({
  title: z.string(),
  year: z.number().int().min(1895),
  imdbID: z.string(),
  poster: z.string(),
})

export type CreateMovieInput = z.infer<typeof createMovieSchema>

export const movieOutputSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  year: z.number().int().min(1895),
  imdbID: z.string(),
  poster: z.string(),
})

export type MovieOutput = z.infer<typeof movieOutputSchema>

export const populatedMovieOutputSchema = z.object({
  label: z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  movieId: z.number(),
  labelId: z.number(),
})
