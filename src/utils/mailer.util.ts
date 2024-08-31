import nodemailer from 'nodemailer'
import { logger } from './logger.util'
import { env } from './../config'
import { readFileSync } from 'fs'
import handlebars from 'handlebars'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SU_EMAIL,
    pass: env.SU_PASSWORD_APP
  }
})

export const sendPassword = (email: string, passwordText: string) => {
  try {
    let file = readFileSync(`${global.appRoot}/views/password.html`, { encoding: 'utf-8' })
    let template = handlebars.compile(file)
    let replacements = {
      email,
      password: passwordText
    }
    let html = template(replacements)
    let msg = {
      from: env.SU_EMAIL,
      to: email,
      subject: 'TaraGo Account Verification',
      html
    }
    transporter.sendMail(msg)
  } catch(e: any) {
    logger('mailer.util', 'sendPassword', e.message, 'MLR-0001')
  }
}

export const sendUploadLinkSupportDocs = (email: string, link: string) => {
  try {
    let file = readFileSync(`${global.appRoot}/views/support-docs-link.html`, { encoding: 'utf-8' })
    let template = handlebars.compile(file)
    let replacements = {
      link
    }
    let html = template(replacements)
    let msg = {
      from: env.SU_EMAIL,
      to: email,
      subject: 'Request for Supporting Documents (Proprietor Application)',
      html
    }
    transporter.sendMail(msg)
  } catch(e: any) {
    logger('mailer.util', 'sendUploadLinkSupportDocs', e.message, 'MLR-0002')
  }
}