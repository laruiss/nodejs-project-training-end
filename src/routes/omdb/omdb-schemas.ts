import { z } from 'zod'

const omdbSearchMediaSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: z.enum(['movie', 'series']),
  Poster: z.string(),
})

export const omdbSearchResponseSchema = z.object({
  Search: z.array(omdbSearchMediaSchema),
  totalResults: z.string(),
  Response: z.enum(['True', 'False']),
})

export type OmdbSearchResponse = z.infer<typeof omdbSearchResponseSchema>

export const omdbMediaSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: z.enum(['movie', 'series']),
  Poster: z.string(),
  Language: z.string(),
  Country: z.string(),
  Director: z.string(),
  Actors: z.string(),
  Genre: z.string(),
  Awards: z.string(),
  Ratings: z.array(
    z.object({
      Source: z.string(),
      Value: z.string(),
    }),
  ),
  Plot: z.string(),
  Metascore: z.string(),
  imdbRating: z.string(),
  imdbVotes: z.string(),
  DVD: z.string(),
  BoxOffice: z.string(),
  Production: z.string(),
  Website: z.string(),
  Runtime: z.string(),
  Response: z.string(),
})

export type Media = z.infer<typeof omdbMediaSchema>
