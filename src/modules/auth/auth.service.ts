import { Response } from "express";
import * as jwt from 'jsonwebtoken';
import { env } from './../../config'
import { PersonalAccessToken } from './schema/PersonalAccessToken.schema'
import Auth from './schema/Auth.schema'
import { IAuthSchema } from "./auth.interface";
import { IPersonalAccessTokenSchema } from "./auth.interface";
import { logger } from './../../utils';

let generateToken = async (res: Response, a: Express.User): Promise<Response<{ token: string }>> => {
  try {
    let auth: IAuthSchema = <IAuthSchema>a
    let token: { access: string, refresh: string } = auth.generateToken()
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

let logout = async (res: Response, a: Express.User, accessToken: string): Promise<Response<null>> => {
  try {
    let auth: IAuthSchema = <IAuthSchema>a;
    await PersonalAccessToken.findOneAndDelete({ userId: auth.userId, accessToken }).exec()
    return res.sendStatus(200)
  } catch(e: any) {
    logger('auth.controller', 'logout', e.message, 'AUTH-0002')
    return res.status(500).json({ code: 'AUTH-0002' })
  }
}

let requestToken = async (res: Response, accessToken: string): Promise<Response<{ token: string }>> => {
  try {
    let decode: jwt.JwtPayload = <jwt.JwtPayload>jwt.decode(accessToken)
    let auth: IAuthSchema = <IAuthSchema>(await Auth.findById(decode.sub).exec())
    if(!auth) return res.status(403).json({ msg: 'NO_ACCT' })
    let pat: IPersonalAccessTokenSchema = <IPersonalAccessTokenSchema>(await PersonalAccessToken.findOne({ accessToken, userId: decode.sub }).exec())
    if(!pat) return res.status(403).json({ msg: 'FORBIDDEN' })
    if(!jwt.verify(pat.refreshToken, env.JWT_SECRET)) return res.status(403).json({ msg: 'SESSION_EXPIRED' })
    let { access, refresh} = auth.generateToken()
    pat.accessToken = access
    pat.refreshToken = refresh
    pat.save()
    return res.status(200).json({ token: access })
  } catch(e: any) {
    logger('auth.controller', 'requestToken', e.message, 'AUTH-0003')
    return res.status(500).json({ code: 'AUTH-0003' })
  }
}

const AuthService = {
  generateToken,
  logout,
  requestToken
}

export default AuthService