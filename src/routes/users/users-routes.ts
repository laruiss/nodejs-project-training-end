import { z } from 'zod'

import { type MyMediaPlugin, errorResponseBodySchema } from '../../types/index.js'
import config from '../../config.js'

import { createUserInputSchema, passwordSchema, userOutputSchema } from './users-schemas.js'

const usersRoutes: MyMediaPlugin = async function usersRoutes (app) {
  app.post('', {
    schema: {
      body: createUserInputSchema,
      response: {
        201: userOutputSchema,
      },
    },
    handler: async (req, reply) => {
      const user = req.body
      const {
        validationToken,
        user: createdUser,
      } = await app.prisma.user.signUp(user)

      const validateUrl = `${config.baseFrontUrl}/users/${createdUser.id}/validate?token=${validationToken}`

      await app.mail.send(user.email, { // TODO: handle error
        subject: '[MyMedia] Almost done!',
        body: `<h1>One more step to enter MyMedia!</h1>
<p>Please click on (or copy-paste in a browser) this link to validate your account: </p>
<p><a href="${validateUrl}">${validateUrl}</a></p>
`,
      })

      reply.status(201)
      return createdUser
    },
  })

  app.put('/:id/validationDate', {
    schema: {
      params: z.object({ id: z.string() }),
      querystring: z.object({ token: z.string() }),
      response: {
        200: userOutputSchema,
        400: errorResponseBodySchema.extend({ status: z.literal(400) }),
        404: errorResponseBodySchema.extend({ status: z.literal(404) }),
      },
    },
    handler: async (req, reply) => {
      const id = Number(req.params.id)
      const token = req.query.token
      const user = await app.prisma.user.findUnique({ where: { id } })
      if (!user) {
        reply.status(404)
        return {
          status: 404,
          message: 'USER_NOT_FOUND',
        } as const
      }
      if (user.validationToken !== token) {
        reply.status(400)
        return {
          status: 400,
          message: 'INVALID_TOKEN',
        } as const
      }
      if (user?.validationDate) {
        reply.status(400)
        return {
          status: 400,
          message: 'ALREADY_VALIDATED',
        } as const
      }
      if (user.validationTokenExpiry! < new Date()) {
        reply.status(400)
        return {
          status: 400,
          message: 'EXPIRED_TOKEN',
        } as const
      }

      const validatedUser = await app.prisma.user.update({
        where: { id },
        data: {
          validationToken: null,
          validationTokenExpiry: null,
          validationDate: new Date(),
        },
      })

      await app.mail.send(user.email, { // TODO: handle error
        subject: 'Welcome to MyMedia!',
        body: `<h1>Welcome to MyMedia!</h1>
<p>You are now a validated user of MyMedia!</p>
`,
      })

      return validatedUser
    },
  })

  app.put('/:id/password', {
    schema: {
      params: z.object({ id: z.string() }),
      querystring: z.object({ token: z.string({ required_error: 'INVALID_TOKEN' }).min(1, { message: 'INVALID_TOKEN' }) }),
      body: z.object({ password: passwordSchema }),
      response: {
        200: userOutputSchema,
        400: errorResponseBodySchema.extend({ status: z.literal(400) }),
        404: errorResponseBodySchema.extend({ status: z.literal(404) }),
      },
    },
    handler: async (req, reply) => {
      const id = Number(req.params.id)
      const token = req.query.token
      const newPassword = req.body.password
      const user = await app.prisma.user.findUnique({ where: { id } })
      if (!user) {
        reply.status(404)
        return {
          status: 404,
          message: 'USER_NOT_FOUND',
        } as const
      }
      if (user.validationToken !== token) {
        reply.status(400)
        return {
          status: 400,
          message: 'INVALID_TOKEN',
        } as const
      }
      if (user.validationTokenExpiry! < new Date()) {
        reply.status(400)
        return {
          status: 400,
          message: 'EXPIRED_TOKEN',
        } as const
      }

      const validatedUser = await app.prisma.user.changePassword(id, newPassword)

      await app.mail.send(user.email, { // TODO: handle error
        subject: '[MyMedia] Password reset',
        body: `<h1>Password reset for your MyMedia account!</h1>
<p>You can now log in with your new password <a href="${config.baseFrontUrl}">${config.baseFrontUrl}</a></p>
`,
      })

      return validatedUser
    },
  })

  const authUsersRoutes: MyMediaPlugin = async function authUsersRoutes (app) {
    app.addHook('preHandler', app.authenticate)
    app.get('', {
      schema: {
        querystring: z.object({
          limit: z.number().int().positive().default(10),
          offset: z.number().int().nonnegative().default(0),
        }),
        response: {
          200: z.object({
            total: z.number(),
            users: z.array(userOutputSchema),
          }),
        },
      },
      handler: async (req) => {
        const { limit: take, offset: skip } = req.query
        const [total, users] = await app.prisma.$transaction([
          app.prisma.user.count(),
          app.prisma.user.findMany({ skip, take }),
        ])
        return {
          total,
          users,
        }
      },
    })

    app.get('/:id', {
      schema: {
        params: z.object({ id: z.string() }),
        response: {
          200: userOutputSchema.nullable(),
        },
      },
      handler: async (req) => {
        const id = Number(req.params.id)
        const user = await app.prisma.user.findUnique({ where: { id } })
        return user
      },
    })

    app.patch('/:id', {
      schema: {
        params: z.object({ id: z.string() }),
        body: createUserInputSchema.omit({ password: true }),
        response: {
          200: userOutputSchema.nullable(),
          404: errorResponseBodySchema.extend({ status: z.literal(404) }),
        },
      },
      handler: async (req, reply) => {
        const id = +req.params.id
        const userToUpdate = await app.prisma.user.findUnique({ where: { id } })
        if (!userToUpdate) {
          reply.status(404)
          return {
            status: 404,
            message: 'NO_USER_FOUND',
          } as const
        }
        const newUserData = req.body
        const updatedUser = await app.prisma.user.update({ where: { id }, data: newUserData })
        return updatedUser
      },
    })
  }

  app.register(authUsersRoutes)
}

export default usersRoutes
