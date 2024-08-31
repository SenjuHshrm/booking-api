import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { env } from './../config'
import multer, { Multer, StorageEngine } from 'multer'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

let supportDocs: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    let dest = join(global.appRoot, `/uplaods/docs/${req.params.id}`)
    if(!existsSync(join(global.appRoot, '/uplaods/docs'))) mkdirSync(join(global.appRoot, '/uplaods/docs'))
    if(!existsSync(dest)) mkdirSync(dest)
    cb(null, dest)
  },
  filename: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    cb(null, file.originalname)
  }
})

export const uploadSupportingDocs: Multer = multer({ dest: '/uplaods/docs', storage: supportDocs })

export const uploadDocsAuth = (req: Request, res: Response, next: NextFunction) => {
  let auth: string[] | undefined = req.headers.authorization?.split(' ')
  if(auth === undefined) return res.status(400).json({ msg: 'Unauthorized' })
  if(!jwt.verify(auth[1], env.JWT_SECRET)) return res.status(400).json({ msg: 'Expired' })
  return next()
}

