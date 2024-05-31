import { env } from './../config'
import crypto from 'node:crypto'

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