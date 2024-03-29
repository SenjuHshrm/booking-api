import { Request, Response, NextFunction } from 'express'

export const header = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Content-Security-Policy', 'frame-ancestors "none"')
  next()
}