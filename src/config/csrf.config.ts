import { doubleCsrf, CsrfSecretRetriever, TokenRetriever } from 'csrf-csrf'
import { Request, Response, NextFunction } from 'express'
import { env } from '../config'

export const csrf = doubleCsrf({
  getSecret: <CsrfSecretRetriever>((req: Request) => req.secret),
  cookieName: `${env.DOMAIN_NAME}.${env.CSRF_COOKIE_NAME}`,
  cookieOptions: {
    sameSite: 'lax',
    path: '/',
    secure: true,
    signed: true,
    domain: 'localhost',
  },
  size: 32,
  ignoredMethods: [ "GET", "HEAD", "OPTIONS" ],
  getTokenFromRequest: <TokenRetriever>((req: Request) => <string>req.headers[env.CSRF_HEADER_NAME])
})


export const csrfErrorHandler = (e: Error | null, req: Request, res: Response, next: NextFunction) => {
  console.log("ERROR: ", e)
  console.log(req.headers[env.CSRF_HEADER_NAME])
  if(e === csrf.invalidCsrfTokenError) {
    res.status(403).json({
      error: 'CSRF Validation error'
    })
  } else {
    next()
  }
}