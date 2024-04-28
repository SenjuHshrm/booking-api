import { Response } from "express";
import Staycation from './schema/Staycation.schema'
import Review from './schema/Review.schema'
import { IStaycation, IStaycationInput, IStaycationSchema } from './staycation.interface';
import { logger } from './../../utils'

let applyProprietorship = async (res: Response, form: IStaycationInput): Promise<Response<null>> => {
  try {
    new Staycation({ ...form }).save()
    return res.sendStatus(201)
  } catch(e: any) {
    logger('staycation.controller', 'applyProprietorship', e.message, 'STC-0001')
    return res.status(500).json({ code: 'STC-0001' })
  }
}

let getListings = async (res: Response, page: number, limit: number, isListed: boolean): Promise<Response<IStaycation[]>> => {
  try {
    let listings: IStaycationSchema[] = <IStaycationSchema[]>(await Staycation.find({ isListed }).populate('host', { path: "_id name img" }).skip(page).limit(limit).exec())
    return res.status(200).json(listings)
  } catch(e: any) {
    logger('staycation.controller', 'getListings', e.message, 'STC-0002')
    return res.status(500).json({ code: 'STC-0002' })
  }
}

let updateStaycation = async (res: Response, id: string, form: IStaycationInput): Promise<Response<null>> => {
  try {
    Staycation.findByIdAndUpdate(id, { $set: { ...form } })
    return res.sendStatus(200)
  } catch(e: any) {
    logger('staycation.controller', 'updateStaycation', e.message, 'STC-0003')
    return res.status(500).json({ code: 'STC-0003' })
  }
}

let updateListing = async (res: Response, id: string, isListed: boolean): Promise<Response<null>> => {
  try {
    Staycation.findByIdAndUpdate(id, { $set: { isListed } })
    return res.sendStatus(200)
  } catch(e: any) {
    logger('staycation.controller', 'updateListing', e.message, 'STC-0004')
    return res.status(500).json({ code: 'STC-0004' })
  }
}

let removeStaycation = async (res: Response, id: string): Promise<Response<null>> => {
  try {
    Staycation.findByIdAndDelete(id)
    Review.deleteMany({ staycation: id })
    return res.sendStatus(200)
  } catch(e: any) {
    logger('staycation.controller', 'removeStaycation', e.message, 'STC-0005')
    return res.status(500).json({ code: 'STC-0005' })
  }
}



const StaycationService = {
  applyProprietorship,
  getListings,
  updateStaycation,
  updateListing,
  removeStaycation
}

export default StaycationService