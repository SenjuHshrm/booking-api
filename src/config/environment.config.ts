import dotenv from 'dotenv'

dotenv.config()

export const env = {
  HOST: <string>process.env.HOST,
  NODE_ENV: <string>process.env.NODE_ENV,
  ORIGIN: (<string>process.env.ORIGIN)?.split(' '),
  JWT_SECRET: <string>process.env.JWT_SECRET,
  MONGODB_NAME: <string>process.env.MONGODB_NAME,
  MONGODB_URI: <string>process.env.MONGODB_URI,
  MONGODB_USER: <string>process.env.MONGODB_USER,
  MONGODB_PASS: <string>process.env.MONGODB_PASS,
  REDIS_URL: <string>process.env.REDIS_URL,
  SIO_ADMIN_USERNAME: <string>process.env.SIO_ADMIN_USERNAME,
  SIO_ADMIN_PASSWORD: <string>process.env.SIO_ADMIN_PASSWORD,
  ADMIN_EMAIL: <string>process.env.ADMIN_EMAIL,
  ADMIN_PASS: <string>process.env.ADMIN_PASS,
  ADMIN_FIRSTNAME: <string>process.env.ADMIN_FIRSTNAME,
  ADMIN_MIDDLENAME: <string>process.env.ADMIN_MIDDLENAME,
  ADMIN_LASTNAME: <string>process.env.ADMIN_LASTNAME,
  ADMIN_EXTNAME: <string>process.env.ADMIN_EXTNAME,
  ADMIN_IMG: <string>process.env.ADMIN_IMG,
  ADMIN_ADDRESS: <string>process.env.ADMIN_ADDRESS
}

