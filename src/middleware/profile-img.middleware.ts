import { Request } from "express";
import multer, { Multer, StorageEngine } from 'multer';
import { existsSync, mkdirSync } from "fs";
import { join } from 'path';

let profileImgStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    let dest: string = join(global.appRoot, `/uploads/profile-img/${req.body.email}`)
    if(!existsSync(join(global.appRoot, '/uploads/profile-img'))) mkdirSync(join(global.appRoot, '/uploads/profile-img'))
    if(!existsSync(dest)) mkdirSync(dest)
    cb(null, dest)
  },
  filename: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    cb(null, file.originalname)
  }
})

export const profileImgStorageMedia: Multer = multer({ dest: '', storage: profileImgStorage })