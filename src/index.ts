import process from 'node:process'

import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import {
  // createJsonSchemaTransform, // For skiplist, see below
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import type {
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import prismaPlugin from './plugins/prisma-plugin.js'
import mailPlugin from './plugins/mailer/mail-plugin.js'
import omdbRoutes from './routes/omdb/omdb-routes.js'
import usersRoutes from './routes/users/users-routes.js'
import moviesRoutes from './routes/movies/movies-routes.js'
import labelsRoutes from './routes/labels/labels-routes.js'
import authRoutes from './routes/auth/auth-routes.js'
import config from './config.js'
import authPlugin from './plugins/auth-plugin.js'

const {
  port,
  host,
  swaggerDocsPrefix,
} = config

const logger = config.isDev
  ? {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    }
  : true

const app = Fastify({
  logger,
})
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  .withTypeProvider<ZodTypeProvider>()

await app.register(cookie, {
  secret: config.cookieSecret,
})

await app.register(cors, {
  credentials: true,
  origin: ['http://192.168.0.37:5173', 'http://192.168.0.37:5174', 'http://localhost:5173'],
})
await app.register(helmet)

if (config.throttle) {
  await app.addHook('preHandler', () => new Promise(resolve => setTimeout(resolve, config.throttle)))
}

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API My Movies',
      description: 'Description of the My Movies\' API',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
  // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
  //
  // transform: createJsonSchemaTransform({
  //   skipList: [ '/documentation/static/*' ]
  // })
})

app.register(fastifySwaggerUI, {
  routePrefix: swaggerDocsPrefix,
})

await app.register(authPlugin, { secret: config.jwtSecret })
await app.register(mailPlugin)
await app.register(prismaPlugin)
app.register(omdbRoutes, { prefix: '/omdb' })
app.register(usersRoutes, { prefix: '/users' })
app.register(authRoutes, { prefix: '/auth' })
app.register(moviesRoutes, { prefix: '/movies' })
app.register(labelsRoutes, { prefix: '/labels' })

app.setErrorHandler((error, request, reply) => {
  app.log.error(error)
  const status = error?.statusCode ?? 500
  reply.status(status).send({
    status,
    message: error.message ?? error ?? 'Unknown internal error occured',
  })
})

try {
  await app.ready()
  await app.listen({ port, host })

  app.log.info(`Documentation running at http://${host}:${port}${swaggerDocsPrefix}`)

  process.on('SIGTERM', async () => { // kill
    app.log.info('SIGTERM signal received. Shutting down...')
    await app.close()
    process.exit(0)
  })
  process.on('SIGINT', async () => { // Ctrl + C
    app.log.info('SIGINT signal received. Shutting down...')
    await app.close()
    process.exit(0)
  })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
