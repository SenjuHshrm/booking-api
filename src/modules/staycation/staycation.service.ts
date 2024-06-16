import { IUserSchema } from './../user/user.interface';
import { Response } from "express";
import Staycation from './schema/Staycation.schema'
import ProprietorApplication from './../user/schema/ProprietorApplication.schema'
import Review from './schema/Review.schema'
import { IStaycation, IStaycationInput, IStaycationSchema } from './staycation.interface';
import { logger } from './../../utils'
import User from '../user/schema/User.schema';

let applyProprietorship = async (res: Response, form: IStaycationInput): Promise<Response<{ success: boolean }>> => {
  try {
    let staycation: IStaycationSchema = await new Staycation({ ...form }).save()
    let user: IUserSchema = <IUserSchema>(await User.findById(form.host).exec())
    if(!user.status.includes('host')) {
      await new ProprietorApplication({ userId: form.host, staycationId: staycation.id }).save()
    }
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('staycation.controller', 'applyProprietorship', e.message, 'STC-0001')
    return res.status(500).json({ code: 'STC-0001' })
  }
}

let getListings = async (res: Response, page: number, limit: number, query: any): Promise<Response<{ total: number, listings: IStaycation[] }>> => {
  try {
    let filterQuery: any = {}
    Object.keys(query).forEach((x: string) => {
      if(query[x] !== undefined) filterQuery[x] = query[x]
    })
    console.log(filterQuery)
    let total = await Staycation.countDocuments({ ...filterQuery }).exec()
    let listings: IStaycationSchema[] = <IStaycationSchema[]>(await Staycation.find({ ...filterQuery }).populate('host', { path: "_id name img" }).skip(page).limit(limit).exec())
    return res.status(200).json({ total, listings })
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

let updateListing = async (res: Response, id: string, isListed: boolean): Promise<Response<{ success: boolean }>> => {
  try {
    await Staycation.findByIdAndUpdate(id, { $set: { isListed } }).exec()
    return res.status(200).json({ success: true })
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

let getHostListing = async (res: Response, userId: string, page: number, limit: number): Promise<Response> => {
  try {
    let total = await Staycation.countDocuments({ host: userId, isApproved: true }).exec()
    let listings: IStaycationSchema[] = <IStaycationSchema[]>(await Staycation.find({ host: userId, isApproved: true }).skip(page).limit(limit).exec())
    return res.status(200).json({ total, listings })
  } catch(e: any) {
    logger('staycation.controller', 'getHostListing', e.message, 'STC-0006')
    return res.status(500).json({ code: 'STC-0005' })
  }
}

let getDetails = async (res: Response, _id: string): Promise<Response<IStaycation>> => {
  try {
    let detail: IStaycationSchema = <IStaycationSchema>(await Staycation.findById(_id).populate({ path: 'host', select: 'name img' }).exec())
    return res.status(200).json(detail)
  } catch(e: any) {
    logger('staycation.controller', 'getDetails', e.message, 'STC-0007')
    return res.status(500).json({ code: 'STC-0007' })
  }
}

let getGallery = async (res: Response, _id: string): Promise<Response<any>> => {
  try {
    let detail: IStaycationSchema = <IStaycationSchema>(await Staycation.findById(_id, { media: 1 }).exec())
    let resp: string[] = []
    resp.push(<string>detail.media.cover)
    detail!.media.imgs.forEach((img: string) => {
      resp.push(img)
    })
    return res.status(200).json(resp)
  } catch(e: any) {
    logger('staycation.controller', 'getGallery', e.message, 'STC-0008')
    return res.status(500).json({ code: 'STC-0008' })
  }
}



const StaycationService = {
  applyProprietorship,
  getListings,
  updateStaycation,
  updateListing,
  removeStaycation,
  getHostListing,
  getDetails,
  getGallery
}

export default StaycationService