import { Request } from 'express'
import multer, { Multer, StorageEngine } from 'multer'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

let userVerificationStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    let destUV = join(global.appRoot, `/uploads/user-verification/${req.body.id}`)
    if(!existsSync(join(global.appRoot, '/uploads/user-verification'))) mkdirSync(join(global.appRoot, '/uploads/user-verification'))
    if(!existsSync(destUV)) mkdirSync(destUV)
    cb(null, destUV)
  },
  filename: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    cb(null, file.originalname)
  }
})

export const uploadUserVerification: Multer = multer({ dest: '/uploads/user-verification', storage: userVerificationStorage })