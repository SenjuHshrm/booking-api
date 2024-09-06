import { Request } from "express";
import multer, { Multer, StorageEngine } from 'multer'
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

let reviewMediaStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    let destRevImg = join(global.appRoot, `/uploads/staycation/${req.body.serverDirName}/reviews`)
    if(!existsSync(destRevImg)) mkdirSync(destRevImg)
    cb(null, destRevImg)
  },
  filename: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    cb(null, file.originalname)
  } 
})

export const uploadReviewMedia: Multer = multer({ dest: '/uploads/staycation', storage: reviewMediaStorage })