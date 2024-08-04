import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

import config from '../../config.js'
/**
 * Configuration du transporteur de courriel
 *
 * @module
 */

const host = config.smtpHost
const port = config.smtpPort

const user = config.smtpUser
const pass = config.smtpPass
const isDev = config.isDev

const auth = user
  ? { user, pass }
  : undefined

const smtpSecure = !isDev

export const transportOptions: SMTPTransport.Options = {
  host,
  port,
  secure: smtpSecure,
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3',
  },
  ...(auth ? { auth } : undefined),
}

/**
 * Renvoie les informations necessaires à l'envoi du courriel
 *
 */
export const getMailTransporter = () => nodemailer.createTransport(transportOptions)

/**
 * Renvoie la variable d'environnement de l'adresse courriel de l'expéditeur
 *
 */
export const getMailFrom = () => config.emailSender
