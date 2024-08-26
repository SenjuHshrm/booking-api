import { Request } from "express";
import multer, { Multer, StorageEngine } from 'multer';
import { existsSync, mkdirSync } from "fs";
import { join } from 'path';

let imgCarouselLocStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    let dest: string = join(global.appRoot, '/uploads/homepage/carousel-location')
    if(!existsSync(join(global.appRoot, '/uploads/homepage'))) mkdirSync(join(global.appRoot, '/uploads/homepage'))
    if(!existsSync(dest)) mkdirSync(dest)
    cb(null, dest)
  },
  filename: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    cb(null, file.originalname)
  }
})

let imgCarouselFrontStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    let dest: string = join(global.appRoot, '/uploads/homepage/carousel-front')
    if(!existsSync(join(global.appRoot, '/uploads/homepage'))) mkdirSync(join(global.appRoot, '/uploads/homepage'))
    if(!existsSync(dest)) mkdirSync(dest)
    cb(null, dest)
  },
  filename: (req: Request, file: Express.Multer.File, cb: (e: Error | null, d: string) => void) => {
    cb(null, file.originalname)
  }
})

export const uploadCarouselLocImg: Multer = multer({ dest: '/uploads/homepage', storage: imgCarouselLocStorage })
export const uploadCarouselFrontImg: Multer = multer({ dest: '/uploads/homepage', storage: imgCarouselFrontStorage })
