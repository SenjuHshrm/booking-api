import { IStaycationSchema } from './../staycation/staycation.interface';
import { Response } from "express";
import { IUserInput, IUserSchema, IProprietorApplicationSchema, IUser } from './user.interface';
import { IAuthSchema } from "../auth/auth.interface";
import User from './schema/User.schema';
import Auth from '../auth/schema/Auth.schema';
import { logger, randomPassword, sendPassword } from './../../utils';
import ProprietorApplication from "./schema/ProprietorApplication.schema";
import Staycation from './../staycation/schema/Staycation.schema'

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
    })
    user.setImg('', u.email)
    user.save()

    let newPassword = randomPassword()
    let auth: IAuthSchema = new Auth({
      userId: user.id,
      email: u.email,
      access: ['customer']
    })
    auth.generateHash(newPassword)
    auth.save()
    sendPassword(u.email, newPassword)
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

let getProprietorApplications = async (res: Response, page: number, limit: number): Promise<Response> => {
  try {
    let total = await ProprietorApplication.countDocuments().exec()
    let propApp: IProprietorApplicationSchema[] = <IProprietorApplicationSchema[]>(await ProprietorApplication.find({}).populate({ path: 'userId', select: 'name img' }).populate({ path: 'staycationId' }).skip(page).limit(limit).exec())
    return res.status(200).json({ total, propApp })
  } catch(e: any){
    logger('user.controller', 'getProprietorApplications', e.message, 'USR-0003')
    return res.status(500).json({ code: 'USR-0003' })
  }
}

let setAsProprietor = async (res: Response, userId: string, staycationId: string, propAppId: string): Promise<Response<{ success: boolean }>> => {
  try {
    await Auth.findOneAndUpdate({ userId }, { $push: { access: 'host' } }).exec()
    await Staycation.findOneAndUpdate({ _id: staycationId }, { $set: { isApproved: true } }).exec()
    await ProprietorApplication.findByIdAndDelete(propAppId).exec()
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
    logger('user.profile', 'updateUserProfile', e.message, 'USR-0007')
    return res.status(500).json({ code: 'USR-0007' })
  }
}

const UserService = {
  register,
  getUsersByAccess,
  getProprietorApplications,
  setAsProprietor,
  addAdmin,
  getUserProfile,
  updateUserProfile
}

export default UserService