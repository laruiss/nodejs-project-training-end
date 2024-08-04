import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import * as mail from './mail-utils.js'

declare module 'fastify' {
  interface FastifyInstance {
    mail: {
      send: typeof mail.send
      getMailInfo: typeof mail.getMailInfo
    }
  }
}

const mailPlugin: FastifyPluginAsync = fp(async (app) => {
  app.decorate('mail', mail)
})

export default mailPlugin
