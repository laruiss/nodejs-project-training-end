import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

import { getMailFrom, getMailTransporter } from './mail-config.js'

/**
 * Retourne les informations de l'utilisateur, le sujet et le corps du courriel
 *
 * @function
 *
 * @param {string} to - Renvoi l'adresse courriel du destinateur
 * @param {string} subject - Sujet du courriel envoyer à l'utilisateur
 * @param {string} html - Contenu du courriel
 *
 * @returns {Promise.<import('nodemailer').SendMailOptions} - Les informations pour l'envoi du courriel
 */

export function getMailInfo (to: string, subject: string, html: string) {
  return {
    from: getMailFrom(),
    to,
    subject,
    html,
  }
}

export async function send (
  to: string,
  { subject, body: html }: { subject: string, body: string },
): Promise<SMTPTransport.SentMessageInfo> {
  const transporter = getMailTransporter()

  // ETAPE 2
  const mailInfo = getMailInfo(to, subject, html)

  const info = await transporter.sendMail(mailInfo)
  return info
}
