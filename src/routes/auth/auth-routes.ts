import { z } from 'zod'

import { type MyMediaPlugin, errorResponseBodySchema } from '../../types/index.js'
import config from '../../config.js'
import { createUuid } from '../../utils/crypto.js'
import { adminRole, userRole } from '../../plugins/auth-plugin.js'

import { loginSchema } from './auth-schemas.js'

// Use TypeScript module augmentation to declare the type of server.authenticate
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: number
      name: string
      role?: Readonly<['user'] | ['user', 'admin']>
    }
    user: {
      sub: number
      name: string
      role?: Readonly<['user'] | ['user', 'admin']>
    }
  }
}
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

const authRoutes: MyMediaPlugin = async function usersRoutes (app) {
  app.get('/new-tokens', {
    schema: {
      response: {
        200: z.object({
          token: z.string(),
        }),
        401: errorResponseBodySchema.extend({ status: z.literal(401) }),
      },
    },
    handler: async (request, reply) => {
      const { refreshToken } = request.cookies
      if (!refreshToken) {
        reply.status(401)
        return {
          status: 401,
          message: 'NO_REFRESH_TOKEN',
        } as const
      }

      try {
        const { sub: id } = app.jwt.verify(refreshToken) as { sub: number }

        const user = await app.prisma.user.findUnique({ where: { id } })

        if (user?.refreshToken !== refreshToken) {
          throw new Error('INVALID_REFRESH_TOKEN')
        }

        await app.prisma.user.update({ where: { id }, data: { refreshToken } })

        const role = user.email === config.superAdminEmail ? userRole : adminRole

        const token = app.jwt.sign({ sub: user.id, name: user.username, role })

        reply.send({ token })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
        app.log.warn(`Error while refreshing token: ${message}`)
        reply.status(401)
        return {
          status: 401,
          message,
        } as const
      }
    },
  })

  app.post('/tokens', {
    schema: {
      body: loginSchema,
      response: {
        200: z.object({
          token: z.string(),
        }),
        401: errorResponseBodySchema.extend({ status: z.literal(401) }),
      },
    },
    handler: async (req, reply) => {
      const { email, password } = req.body
      const user = await app.prisma.user.findUnique({ where: { email } })
      if (!user) {
        reply.status(401)
        app.log.warn(`Unknown user tried to login: ${email}`)
        return {
          status: 401,
          message: 'WRONG_CREDENTIALS',
        } as const
      }

      const passwordChecked = await app.prisma.user.checkPassword(password, user.password)
      if (!passwordChecked) {
        app.log.warn(`Wrong password for user: ${email}`)
        reply.status(401)
        return {
          status: 401,
          message: 'WRONG_CREDENTIALS',
        } as const
      }

      const role = user.email === config.superAdminEmail ? userRole : adminRole

      const token = app.jwt.sign({ sub: user.id, name: user.username, role })

      const refreshToken = app.jwt.sign({
        sub: user.id,
        name: user.username,
      }, { expiresIn: config.refreshJwtExpiresIn })

      await app.prisma.user.update({ where: { id: user.id }, data: { refreshToken } })

      reply
        .setCookie('refreshToken', refreshToken, {
          // domain: 'localhost',
          // path: '/',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 day
          secure: !config.isDev, // send cookie over HTTPS only
          httpOnly: !config.isDev,
          sameSite: !config.isDev, // alternative CSRF protection
        }).send({ token })
    },
  })

  app.post('/password-reset', {
    schema: {
      body: z.object({
        email: z.string().email({ message: 'The email should be a valid email' }),
      }),
      response: {
        200: z.object({
          status: z.literal(200),
          message: z.string(),
        }),
        404: errorResponseBodySchema,
      },
    },
    handler: async (req) => {
      const { email } = req.body
      const passwordResetToken = createUuid()
      const validationTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
      const user = await app.prisma.user.findUnique({ where: { email } })
      if (!user) {
        return {
          status: 200,
          message: 'PASSWORD_RESET_EMAIL_SENT_IF_EXISTS',
        }
      }

      user.validationToken = passwordResetToken
      user.validationTokenExpiry = validationTokenExpiry
      await app.prisma.user.update({ where: { id: user.id }, data: { validationToken: passwordResetToken, validationTokenExpiry } })

      const passwordResetUrl = `${config.baseFrontUrl}/users/${user.id}/password-reset?token=${passwordResetToken}`

      await app.mail.send(user.email, { // TODO: handle error
        subject: '[MyMedia] Password reset request',
        body: `<h1>Someone requested to reset the password of your account</h1>
<p>If it was you, please click on (or copy-paste in a browser) this link to reset your password:</p>
<p><a href="${passwordResetUrl}">${passwordResetUrl}</a></p>
<p>If it was not you, you can ignore this email.</p>
`,
      })

      return {
        status: 200,
        message: 'PASSWORD_RESET_EMAIL_SENT_IF_EXISTS',
      }
    },
  })
}

export default authRoutes
