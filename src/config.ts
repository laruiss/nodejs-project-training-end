import process from 'node:process'

import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.OMDB_API_KEY
const baseFrontUrl = process.env.BASE_API_URL || 'http://localhost:3000'
const smtpHost = process.env.SMTP_HOST || '0.0.0.0'
const smtpPort = Number(process.env.SMTP_PORT) || 1025
const smtpUser = process.env.SMTP_USER || 'stan@stormier.ninja'
const smtpPass = process.env.SMTP_PASS
const emailSender = process.env.EMAIL_SENDER || 'stan@stormier.ninja'

const omdbBaseUrl = 'http://www.omdbapi.com/'
const apiUrl = `${omdbBaseUrl}?apikey=${apiKey}`
const omdbSearchUrl = `${apiUrl}&s=`
const omdbIdUrl = `${apiUrl}&i=`

const port = Number(process.env.PORT) || 3000
const host = process.env.HOST || '0.0.0.0'
const nodeEnv = process.env.NODE_ENV || 'development'
const isDev = nodeEnv !== 'production'
const isTest = nodeEnv === 'test'
const swaggerDocsPrefix = process.env.SWAGGER_DOCS_PREFIX || '/api-docs'
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'stan@stormier.ninja'

const jwtSecret = process.env.JWT_SECRET || 'jwtSecret'
const accessJwtExpiresIn = process.env.ACCESS_JWT_EXPIRES_IN || '15m'
const refreshJwtExpiresIn = process.env.REFRESH_JWT_EXPIRES_IN || '15m'
const cookieSecret = process.env.JWT_SECRET || 'cookieSecret'

const throttle = Number(process.env.THROTTLE) || 0

export default {
  isDev,
  isTest,
  nodeEnv,
  baseFrontUrl,
  throttle,

  // fastify instance
  port,
  host,
  apiKey,
  swaggerDocsPrefix,

  // mailer data
  smtpHost,
  smtpPort,
  smtpUser,
  smtpPass,
  emailSender,

  // OMOD data
  omdbBaseUrl,
  apiUrl,
  omdbSearchUrl,
  omdbIdUrl,

  // Expiration
  accessJwtExpiresIn,
  refreshJwtExpiresIn,

  // Secrets
  jwtSecret,
  cookieSecret,

  // Super admin email
  superAdminEmail,
}
