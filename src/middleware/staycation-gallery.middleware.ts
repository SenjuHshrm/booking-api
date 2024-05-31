import { Request } from "express";
import multer, { Multer, StorageEngine } from 'multer'
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

let staycationGalleryStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    let dest: string = join(global.appRoot, `/uploads/staycation/${req.body.serverDirName}`)
    if(!existsSync(join(global.appRoot, '/uploads/staycation'))) mkdirSync(join(global.appRoot, '/uploads/staycation'))
    if(!existsSync(dest)) mkdirSync(dest)
    cb(null, dest)
  },
  filename: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    cb(null, file.originalname)
  }
})

export const uploadStaycationMedia: Multer = multer({ dest: '/uploads/staycation', storage: staycationGalleryStorage })