import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

import type { CreateUserInput } from '../routes/users/users-schemas.js'
import { comparePassword, createUuid, hashPassword } from '../utils/crypto.js'

interface UserFromPrisma {
  id: number
  email: string
  username: string
  password: string
  validationToken: string | null
  validationTokenExpiry: Date | null
  validationDate: Date | null
  createdAt: Date | null
  updatedAt: Date | null
}

interface AugmentedPrismaClient extends PrismaClient {
  user: PrismaClient['user'] & {
    signUp: (user: CreateUserInput) => Promise<{
      user: UserFromPrisma
      validationToken: string
    }>
    changePassword: (id: number, newPassword: string) => Promise<UserFromPrisma>
    checkPassword: (password: string, hash: string) => Promise<boolean>
  }
}

// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module 'fastify' {
  interface FastifyInstance {
    prisma: AugmentedPrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (app) => {
  const prisma = new PrismaClient()
    .$extends({
      name: 'userAugmentation',
      model: {
        user: {
          async signUp (user: CreateUserInput) {
            const validationToken = createUuid()
            const validationTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
            const encryptedPassword = await hashPassword(user.password)
            const userData = { ...user, password: encryptedPassword, validationToken, validationTokenExpiry }
            const createdUser = await app.prisma.user.create({ data: userData })

            return { user: createdUser, validationToken }
          },
          async changePassword (id: number, newPassword: string) {
            const encryptedPassword = await hashPassword(newPassword)
            const user = await app.prisma.user.update({
              where: { id },
              data: {
                password: encryptedPassword,
                validationToken: null,
                validationTokenExpiry: null,
              },
            })

            return user
          },
          async checkPassword (password: string, hash: string) {
            return comparePassword(password, hash).catch(() => false)
          },
        },
      },
    })

  await prisma.$connect()

  // Make Prisma Client available through the fastify server instance: app.prisma
  app.decorate('prisma', prisma as unknown as AugmentedPrismaClient)

  app.addHook('onClose', async (app) => {
    await app.prisma.$disconnect()
  })
})

export default prismaPlugin
