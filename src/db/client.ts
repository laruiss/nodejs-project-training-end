import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultPaginationOptions = {
  skip: 0,
  take: 10,
}

export async function getAllMovies (paginationOptions: Parameters<PrismaClient['movie']['findMany']>[0]) {
  return prisma.movie.findMany({ ...defaultPaginationOptions, ...paginationOptions })
}

export async function insertMovie (movie: Parameters<PrismaClient['movie']['create']>[0]) {
  return prisma.movie.create(movie)
}

export const disconnect = () => prisma.$disconnect()
