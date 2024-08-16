import { IStaycation, IStaycationSchema } from './../staycation/staycation.interface';
import { Response } from "express";
import { IUserInput, IUserSchema, IProprietorApplicationSchema, IUser, IWishlistSchema } from './user.interface';
import { IAuthSchema } from "../auth/auth.interface";
import User from './schema/User.schema';
import Auth from '../auth/schema/Auth.schema';
import { logger, randomPassword, sendPassword } from './../../utils';
import ProprietorApplication from "./schema/ProprietorApplication.schema";
import Staycation from './../staycation/schema/Staycation.schema'
import Wishlist from './schema/Wishlist.schema';
import { join } from 'path';
import moment from 'moment';
import PaymentService from './../payment/payment.service'

let register = async (res: Response, u: IUserInput): Promise<Response<{ success: boolean }>> => {
  try {
    let user: IUserSchema = new User({
      name: {
        fName: u.fName,
        mName: '',
        lName: u.lName,
        xName: ''
      },
      status: 'active',
      identificationStat: 'pending',
      approvedAsProprietorOn: ''
    })
    user.setImg('', u.email)
    user.save()

    // let newPassword = randomPassword()
    let auth: IAuthSchema = new Auth({
      userId: user.id,
      email: u.email,
      access: ['customer']
    })
    auth.generateHash(u.password)
    auth.save()
    // sendPassword(u.email, newPassword)
    PaymentService.addCustomer(user.id, u, '')
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('user.controller', 'register', e.message, 'USR-0001')
    return res.status(500).json({ code: 'USR-0001' })
  }
}

let getUsersByAccess = async (res: Response, access: string, page: number, limit: number): Promise<Response> => {
  try {
    let total = await Auth.countDocuments({ access }).exec()
    let auth: IAuthSchema[] = <IAuthSchema[]>(await Auth.find({ access }, { password: 0 }).populate({ path: 'userId', select: 'name status img' }).skip(page).limit(limit).exec())
    return res.status(200).json({
      total,
      auth
    })
  } catch(e: any) {
    logger('user.controller', 'getUsersByAccess', e.message, 'USR-0002')
    return res.status(500).json({ code: 'USR-0002' })
  }
}

let getProprietorApplications = async (res: Response, page: number, limit: number, approvedAsProprietorOn?: string): Promise<Response> => {
  try {
    let pipelineMatch = {}
    if(approvedAsProprietorOn === 'true') {
      pipelineMatch = { 'user.approvedAsProprietorOn': { $ne: '' } }
    } else {
      pipelineMatch = { 'user.approvedAsProprietorOn': '' }
    }
  
    let propApp = await ProprietorApplication.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $match: pipelineMatch
      },
      {
        $project: {
          "_id": 1,
          "userId": 1,
          "createdAt": 1,
          "updatedAt": 1,
          "user.name": 1,
          "user.img": 1,
          "user.approvedAsProprietorOn": 1,
        }
      },
      {
        $facet: {
          paginatedResults: [{ $skip: page}, {$limit: limit }],
          totalCount: [
            {$count: 'count'}
          ]
        }
      }
    ]).exec()
    return res.status(200).json(propApp)
  } catch(e: any){
    logger('user.controller', 'getProprietorApplications', e.message, 'USR-0003')
    return res.status(500).json({ code: 'USR-0003' })
  }
}

let setAsProprietor = async (res: Response, userId: string, staycationId: string, propAppId: string): Promise<Response<{ success: boolean }>> => {
  try {
    await Auth.findOneAndUpdate({ userId }, { $push: { access: 'host' } }).exec()
    await User.findByIdAndUpdate(userId, { $set: { approvedAsProprietorOn: moment(new Date()) } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('user.controller', 'setAsProprietor', e.message, 'USR-0004')
    return res.status(500).json({ code: 'USR-0004' })
  }
}

let addAdmin = async (res: Response, u: any): Promise<Response<{ success: boolean }>> => {
  try {
    let user: IUserSchema = new User({
      name: {
        fName: u.fName,
        mName: '',
        lName: u.lName,
        xName: ''
      },
      status: 'active',
      identificationStat: 'pending'
    })
    user.setImg(u.imgFile, u.email)
    user.save()

    let auth: IAuthSchema = new Auth({
      email: u.email,
      userId: user.id,
      access: ['admin']
    })
    auth.generateHash(u.password)
    auth.save()

    sendPassword(u.email, u.password)
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('user.controller', 'addAdmin', e.message, 'USR-0005')
    return res.status(500).json({ code: 'USR-0005' })
  }
}

let getUserProfile = async (res: Response, _id: string): Promise<Response<{ auth: { email: string, auth: string }, profile: IUser }>> => {
  try {
    let auth: IAuthSchema = <IAuthSchema>(await Auth.findOne({ userId: _id }, { email: 1, access: 1 }).exec())
    let user: IUserSchema = <IUserSchema>(await User.findById(_id).exec())
    let prop: IStaycationSchema[] = <IStaycationSchema[]>(await Staycation.find({ host: _id }).exec())
    return res.status(200).json({
      auth: {
        email: auth.email,
        access: auth.access
      },
      profile: user.toJSON(),
      properties: prop
    })
  } catch(e: any) {
    logger('user.controller', 'getUserProfile', e.message, 'USR-0006')
    return res.status(500).json({ code: 'USR-0006' })
  }
}

let updateUserProfile = async (res: Response, profile: any, id: string): Promise<Response<{ success: boolean }>> => {
  try {
    await User.findByIdAndUpdate(id, { $set: { ...profile } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('user.controller', 'updateUserProfile', e.message, 'USR-0007')
    return res.status(500).json({ code: 'USR-0007' })
  }
}

let getWishlistByUser = async (res: Response, user: string): Promise<Response<IStaycation[]>> => {
  try {
    let wl: IWishlistSchema[] = <IWishlistSchema[]>(await Wishlist.find({ user }).populate('staycation').exec())
    return res.status(200).json(wl)
  } catch(e: any) {
    logger('user.controller', 'getWishlistByUser', e.message, 'USR-0008')
    return res.status(500).json({ code: 'USR-0008' })
  }
}

let getUserProfileImg = async (res: Response, id: string): Promise<any> => {
  try {
    let user: IUserSchema = <IUserSchema>(await User.findById(id).exec())
    return res.setHeader('Content-Type', 'image/*').status(200).sendFile(join(global.appRoot, `/uploads${user.img}`))
  } catch(e: any) {
    logger('user.controller', 'getUserProfileImg', e.message, 'USR-0009')
    return res.status(500).json({ code: 'USR-0009' })
  }
}

const UserService = {
  register,
  getUsersByAccess,
  getProprietorApplications,
  setAsProprietor,
  addAdmin,
  getUserProfile,
  updateUserProfile,
  getWishlistByUser,
  getUserProfileImg
}

export default UserService