import fastifyPlugin from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'

import config from '../config.js'

const messages: fastifyJwt.FastifyJWTOptions['messages'] = {
  badRequestErrorMessage: 'BAD_REQUEST_ERROR_MESSAGE',
  badCookieRequestErrorMessage: 'BAD_COOKIE_REQUEST_ERROR_MESSAGE',
  noAuthorizationInHeaderMessage: 'NO_AUTHORIZATION_IN_HEADER_MESSAGE',
  noAuthorizationInCookieMessage: 'NO_AUTHORIZATION_IN_COOKIE_MESSAGE',
  authorizationTokenExpiredMessage: 'AUTHORIZATION_TOKEN_EXPIRED_MESSAGE',
  authorizationTokenUntrusted: 'AUTHORIZATION_TOKEN_UNTRUSTED',
  authorizationTokenUnsigned: 'AUTHORIZATION_TOKEN_UNSIGNED',
  // for the below message you can pass a sync function that must return a string
  authorizationTokenInvalid: (err) => {
    return `INVALID_AUTHORIZATION_TOKEN - ${err.message}`
  },
}

export const userRole = ['user'] as const
export const adminRole = ['user', 'admin'] as const

export default fastifyPlugin(async (app, { secret }: { secret: string }) => {
  app.register(fastifyJwt, {
    secret,
    sign: {
      expiresIn: config.accessJwtExpiresIn,
      iss: 'my-media.stormier.ninja',
    },
    messages,
  })

  app.decorate('createNewRefreshToken', async (id: number, name: string) => {
    const refreshToken = app.jwt.sign({
      name,
      sub: id,
    }, { expiresIn: '1d' })

    await app.prisma.user.update({ where: { id }, data: { refreshToken } })
    return refreshToken
  })

  app.decorate('authenticate', async (request) => {
    await request.jwtVerify()
  })
})
