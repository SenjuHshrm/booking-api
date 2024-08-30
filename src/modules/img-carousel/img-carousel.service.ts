import {
  IImageCarouselFront,
  IImageCarouselFrontInput,
  IImageCarouselLocInput,
  IImageCarouselLoc,
  IImageCarouselFrontSchema,
  IImageCarouselLocSchema
} from './img-carouse.interface';
import { Response } from 'express';
import ImageCarouselLocation from './schema/ImgCarouselLoc.schema'
import ImageCarouselFront from './schema/ImgCarouselFront.schema'
import { logger } from './../../utils'
import { unlinkSync } from 'fs'
import { join } from 'path'

let addImgFront = async (res: Response, data: IImageCarouselFrontInput): Promise<Response> => {
  try {
    await new ImageCarouselFront({ ...data }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('img-carousel.controller', 'addImgFront', e.message, 'IMC-0001')
    return res.status(500).json({ code: 'IMC-0001' })
  }
}

let addImgLoc = async (res: Response, data: IImageCarouselLocInput): Promise<Response> => {
  try {
    await new ImageCarouselLocation({ ...data }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('img-carousel.controller', 'addImgLoc', e.message, 'IMC-0002')
    return res.status(500).json({ code: 'IMC-0002' })
  }
}

let updateImgFront = async (res: Response, id: string, data: IImageCarouselFrontInput): Promise<Response> => {
  try {
    await ImageCarouselFront.findByIdAndUpdate(id, { $set: { ...data } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('img-carousel.controller', 'udpateImgFront', e.message, 'IMC-0003')
    return res.status(500).json({ code: 'IMC-0003' })
  }
}

let updateImgLoc = async (res: Response, id: string, data: IImageCarouselLocInput): Promise<Response> => {
  try {
    await ImageCarouselLocation.findByIdAndUpdate(id, { $set: { ...data } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('img-carousel.controller', 'updateImgLoc', e.message, 'IMC-0004')
    return res.status(500).json({ code: 'IMC-0004' })
  }
}

let deleteImgFront = async (res: Response, id: string): Promise<Response> => {
  try {
    let del: IImageCarouselFrontSchema = <IImageCarouselFrontSchema>(await ImageCarouselFront.findByIdAndDelete(id).exec())
    unlinkSync(join(global.appRoot, `/uploads/${del.img}`))
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('img-carousel.controller', 'deleteImgFront', e.message, 'IMC-0005')
    return res.status(500).json({ code: 'IMC-0005' })
  }
}

let deleteImgLoc = async (res: Response, id: string): Promise<Response> => {
  try {
    let del: IImageCarouselLocSchema = <IImageCarouselLocSchema>(await ImageCarouselLocation.findByIdAndDelete(id).exec())
    unlinkSync(join(global.appRoot, `/uploads/${del.img}`))
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('img-carousel.controller', 'deleteImgLoc', e.message, 'IMC-0006')
    return res.status(500).json({ code: 'IMC-0006' })
  }
}

let getImgFront = async (res: Response, page: number, limit: number): Promise<Response> => {
  try {
    let total: number = await ImageCarouselFront.countDocuments({}).exec()
    let list: IImageCarouselFrontSchema[] = <IImageCarouselFrontSchema[]>(await ImageCarouselFront.find({}).skip(page).limit(limit).exec())
    return res.status(200).json({ total, list })
  } catch(e: any) {
    logger('img-carousel.controller', 'getImgFront', e.message, 'IMC-0007')
    return res.status(500).json({ code: 'IMC-0007' })
  }
}

let getImgLoc = async (res: Response, page: number, limit: number): Promise<Response> => {
  try {
    let total: number = await ImageCarouselLocation.countDocuments({}).exec()
    let list: IImageCarouselLocSchema[] = <IImageCarouselLocSchema[]>(await ImageCarouselLocation.find({}).skip(page).limit(limit).exec())
    return res.status(200).json({ total, list })
  } catch(e: any) {
    logger('img-carousel.controller', 'getImgLoc', e.message, 'IMC-0008')
    return res.status(500).json({ code: 'IMC-0008' })
  }
}

let getActiveImgFront = async (res: Response): Promise<Response> => {
  try {
    let imgs: IImageCarouselFrontSchema[] = <IImageCarouselFrontSchema[]>(await ImageCarouselFront.find({ isActive: true }).exec())
    return res.status(200).json(imgs)
  } catch(e: any) {
    logger('img-carousel.controller', 'getActiveImgFront', e.message, 'IMC-0009')
    return res.status(500).json({ code: 'IMC-0009' })
  }
}

let getActiveImgLoc = async (res: Response): Promise<Response> => {
  try {
    let imgs: IImageCarouselLocSchema[] = <IImageCarouselLocSchema[]>(await ImageCarouselLocation.find({ isActive: true }).exec())
    return res.status(200).json(imgs)
  } catch(e: any) {
    logger('img-carousel.controller', 'getActiveImgLoc', e.message, 'IMC-0010')
    return res.status(500).json({ code: 'IMC-0010' })
  }
}

const ImgCarouselService = {
  addImgFront,
  addImgLoc,
  updateImgFront,
  updateImgLoc,
  deleteImgFront,
  deleteImgLoc,
  getImgFront,
  getImgLoc,
  getActiveImgFront,
  getActiveImgLoc
}

export default ImgCarouselService