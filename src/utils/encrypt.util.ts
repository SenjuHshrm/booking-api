import { env } from './../config'
import crypto from 'node:crypto'
import moment from 'moment'
import * as jwt from 'jsonwebtoken'

const keyBuffer = Buffer.from(env.ENCRYPT_KEY, 'base64')
const ivBuffer = Buffer.from(env.ENCRYPT_IV, 'base64')

export const encrypt = (data: string): string => {
  let cipher = crypto.createCipheriv(env.ENCRYPT_ALGORITHM, keyBuffer, ivBuffer)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export const decrypt = (encrypted: string): string => {
  let decipher = crypto.createDecipheriv(env.ENCRYPT_ALGORITHM, keyBuffer, ivBuffer)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export const generateJWTSupportingDocsLink = (currDate: string, user: string): string => {
  let date = moment(currDate, 'MM/DD/YYYY').add(2, 'days').format('MM/DD/YYYY')
  let token = jwt.sign({ sub: user, expiration: date }, env.JWT_SECRET, { expiresIn: '2d' })
  return `${env.HOST}/supporting-docs?token=${token}&user=${user}`
}