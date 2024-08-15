import { Request } from "express";
import multer, { Multer, StorageEngine } from 'multer'
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

let staycationGalleryStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    // let dest: string = join(global.appRoot, `/uploads/staycation/${req.body.serverDirName}`)
    // if(!existsSync(dest)) mkdirSync(dest)
    // if(!existsSync(join(dest, '/gen-img'))) mkdirSync(join(dest, '/gen-img'))
    // dest = join(dest, '/gen-img')
    // file.fiel
    let destGenImg = join(global.appRoot, `/uploads/staycation/${req.body.serverDirName}/gen-img`)
    let destBedroom = join(global.appRoot, `/uploads/staycation/${req.body.serverDirName}/bedroom`)
    if(!existsSync(join(global.appRoot, '/uploads/staycation'))) mkdirSync(join(global.appRoot, '/uploads/staycation'))
    if(!existsSync(join(global.appRoot, `/uploads/staycation/${req.body.serverDirName}`))) mkdirSync(join(global.appRoot, `/uploads/staycation/${req.body.serverDirName}`))
    if(!existsSync(destGenImg)) mkdirSync(destGenImg)
    if(!existsSync(destBedroom)) mkdirSync(destBedroom)
    switch(file.fieldname) {
      case 'genImg':
        cb(null, destGenImg);
        break;
      case 'bedroom':
        cb(null, destBedroom)
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    cb(null, file.originalname)
  }
})

export const uploadStaycationMedia: Multer = multer({ dest: '/uploads/staycation', storage: staycationGalleryStorage })