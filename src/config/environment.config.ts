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
  SU_EMAIL: <string>process.env.SU_EMAIL,
  SU_PASSWORD_APP: <string>process.env.SU_PASSWORD_APP,
  SIO_ADMIN_USERNAME: <string>process.env.SIO_ADMIN_USERNAME,
  SIO_ADMIN_PASSWORD: <string>process.env.SIO_ADMIN_PASSWORD,
  ADMIN_EMAIL: <string>process.env.ADMIN_EMAIL,
  ADMIN_PASS: <string>process.env.ADMIN_PASS,
  ADMIN_FIRSTNAME: <string>process.env.ADMIN_FIRSTNAME,
  ADMIN_MIDDLENAME: <string>process.env.ADMIN_MIDDLENAME,
  ADMIN_LASTNAME: <string>process.env.ADMIN_LASTNAME,
  ADMIN_EXTNAME: <string>process.env.ADMIN_EXTNAME,
  ADMIN_IMG: <string>process.env.ADMIN_IMG,
  ADMIN_ADDRESS: <string>process.env.ADMIN_ADDRESS,
  ENCRYPT_ALGORITHM: <string>process.env.ENCRYPT_ALGORITHM,
  ENCRYPT_KEY: <string>process.env.ENCRYPT_KEY,
  ENCRYPT_IV: <string>process.env.ENCRYPT_IV,
  PAYMONGO_PK: <string>process.env.PAYMONGO_PK,
  PAYMONGO_SK: <string>process.env.PAYMONGO_SK,
  PAYMONGO_URL: <string>process.env.PAYMONGO_URL,
  PAYMONGO_URL_VER: <string>process.env.PAYMONGO_URL_VER,
  PAYMONGO_PAYMENT_METHODS: JSON.parse(<string>process.env.PAYMONGO_PAYMENT_METHODS),
  CSRF_SECRET: <string>process.env.CSRF_SECRET,
  COOKIE_SECRET: <string>process.env.COOKIE_SECRET,
  CSRF_COOKIE_NAME: <string>process.env.CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME: <string>process.env.CSRF_HEADER_NAME
}

