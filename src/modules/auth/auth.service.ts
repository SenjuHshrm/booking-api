import { Response } from "express";
import * as jwt from 'jsonwebtoken';
import { env } from './../../config'
import { PersonalAccessToken } from './schema/PersonalAccessToken.schema'
import Auth from './schema/Auth.schema'
import { IAuthSchema } from "./auth.interface";
import { IPersonalAccessTokenSchema } from "./auth.interface";
import { logger } from './../../utils';
import User from "./../user/schema/User.schema";
import { IUserSchema } from './../user/user.interface'
import PaymentService from './../payment/payment.service'
import moment from 'moment'

let generateToken = async (res: Response, a: Express.User): Promise<Response<{ token: string }>> => {
  try {
    let auth: IAuthSchema = <IAuthSchema>a
    let user: IUserSchema = <IUserSchema>(await User.findById(auth.userId).exec())
    let token: { access: string, refresh: string } = auth.generateToken(user.img)
    new PersonalAccessToken({
      userId: auth.userId,
      accessToken: token.access,
      refreshToken: token.refresh
    }).save()
    return res.status(200).json({ token: token.access })
  } catch(e: any) {
    logger('auth.controller', 'generateToken', e.message, 'AUTH-0001')
    return res.status(500).json({ code: 'AUTH-0001' })
  }
}

let logout = async (res: Response, a: Express.User, accessToken: string): Promise<Response<{ logout: boolean }>> => {
  try {
    let auth: IAuthSchema = <IAuthSchema>a;
    await PersonalAccessToken.findOneAndDelete({ userId: auth.userId, accessToken }).exec()
    return res.status(200).json({ logout: true })
  } catch(e: any) {
    logger('auth.controller', 'logout', e.message, 'AUTH-0002')
    return res.status(500).json({ code: 'AUTH-0002' })
  }
}

let requestToken = async (res: Response, accessToken: string): Promise<Response<{ token: string }>> => {
  try {
    let decode: jwt.JwtPayload = <jwt.JwtPayload>jwt.decode(accessToken)
    let auth: IAuthSchema = <IAuthSchema>(await Auth.findOne({ userId: decode.sub }).exec())
    if(!auth) return res.status(403).json({ msg: 'NO_ACCT' })
    let pat: IPersonalAccessTokenSchema = <IPersonalAccessTokenSchema>(await PersonalAccessToken.findOne({ accessToken, userId: decode.sub }).exec())
    if(!pat) return res.status(403).json({ msg: 'FORBIDDEN' })
    if(!jwt.verify(pat.refreshToken, env.JWT_SECRET)) return res.status(403).json({ msg: 'SESSION_EXPIRED' })
    let user: IUserSchema = <IUserSchema>(await User.findById(auth.userId).exec())
    let { access, refresh} = auth.generateToken(user.img)
    pat.accessToken = access
    pat.refreshToken = refresh
    pat.save()
    return res.status(200).json({ token: access })
  } catch(e: any) {
    logger('auth.controller', 'requestToken', e.message, 'AUTH-0003')
    return res.status(500).json({ code: 'AUTH-0003' })
  }
}

let updatePassword = async (res: Response, userId: string, password: string): Promise<Response> => {
  try {
    let auth: IAuthSchema = <IAuthSchema>(await Auth.findOne({ userId }).exec())
    auth.generateHash(password)
    auth.save()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('auth.controller', 'updatePassword', e.message, 'AUTH-0004')
    return res.status(500).json({ code: 'AUTH-0004' })
  }
}

let googleLogin = async (res: Response, authData: any, userData: any): Promise<Response> => {
  try {
    let test: IAuthSchema = <IAuthSchema>(await Auth.findOne({ google: authData.id, email: authData.email }).exec())
    if(!test) {
      let u: IUserSchema = <IUserSchema>(await new User({
        name: {
          fName: userData.firstName,
          mName: '',
          lName: userData.lastName,
          xName: ''
        },
        img: userData.photoUrl,
        status: 'active',
        identificationStat: 'pending',
        approvedAsProprietorOn: ''
      }).save())

      let a: IAuthSchema = <IAuthSchema>(await new Auth({
        userId: u.id,
        email: authData.email,
        google: authData.id,
        access: ['customer']
      }).save())
      let token: { access: string, refresh: string } = a.generateToken(u.img)
      new PersonalAccessToken({
        userId: u.id,
        accessToken: token.access,
        refreshToken: token.refresh
      }).save()
      PaymentService.addCustomer(u.id, { fName: userData.firstName, lName: userData.lastName, email: authData.email, password: '' }, '')
      return res.status(200).json({ token: token.access })
    } else {
      let u: IUserSchema = <IUserSchema>(await User.findById(test.userId).exec())
      let t: { access: string, refresh: string } = test.generateToken(u.img)
      new PersonalAccessToken({
        userId: test.userId,
        accessToken: t.access,
        refreshToken: t.refresh
      }).save()
      return res.status(200).json({ token: t.access })
    }
  } catch(e: any) {
    logger('auth.controller', 'googleLogin', e.message, 'AUTH-0005')
    return res.status(500).json({ code: 'AUTH-0005' })
  }
}

let checkStatus = async (auth: Express.User, currentDate: string): Promise<{ res: boolean, msg: string } | null> => {
  try {
    let a: IAuthSchema = <IAuthSchema>auth
    let resp: { res: boolean, msg: string } = { res: false, msg: '' };
    let user: IUserSchema = <IUserSchema>(await User.findById(a.userId).exec())
    switch(user.status) {
      case 'active':
        resp = { res: true, msg: '' };
        break;
      case 'suspended':
        let date = moment(currentDate, 'MM/DD/YYYY')
        let suspensionDue = moment(user.suspendedUntil)
        if(suspensionDue.diff(date, 'days') > 0) resp = { res: false, msg: `Your account is suspended until ${moment(user.suspendedUntil).format('MMMM DD, YYYY')}` }
        user.status = 'active'
        user.suspendedUntil = ''
        user.save()
        resp = { res: true, msg: '' }
        break;
      case 'terminated':
        resp = { res: false, msg: 'Your account is terminated.' }
        break;
    }
    return resp;
  } catch(e: any) {
    logger('auth.controller', 'checkStatus', e.message, 'AUTH-0006')
    return null;
  }
}

const AuthService = {
  generateToken,
  logout,
  requestToken,
  updatePassword,
  googleLogin,
  checkStatus
}

export default AuthService