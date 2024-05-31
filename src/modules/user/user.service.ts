import { Response } from "express";
import { IUserInput, IUserSchema, IProprietorApplicationSchema } from './user.interface';
import { IAuthSchema } from "../auth/auth.interface";
import User from './schema/User.schema';
import Auth from '../auth/schema/Auth.schema';
import { logger, randomPassword, sendPassword } from './../../utils';
import ProprietorApplication from "./schema/ProprietorApplication.schema";
import Staycation from './../staycation/schema/Staycation.schema'

let register = async (res: Response, u: IUserInput): Promise<Response<null>> => {
  try {
    let user: IUserSchema = new User({
      name: {
        fName: u.fName,
        lName: u.lName
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
    return res.sendStatus(201)
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

const UserService = {
  register,
  getUsersByAccess,
  getProprietorApplications,
  setAsProprietor
}

export default UserService