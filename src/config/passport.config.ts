import {
  Strategy as JWTStrategy,
  StrategyOptions,
  VerifiedCallback,
  ExtractJwt
} from "passport-jwt";
import {
  Strategy as LocalStrategy,
  IStrategyOptions,
  IVerifyOptions
} from 'passport-local'
import passport from "passport";

import { IAuthSchema } from "../modules/auth/auth.interface";
import Auth from "../modules/auth/schema/Auth.schema";
import { env } from './environment.config'

let jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET
}

let localOptions: IStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password',
}

passport.use('jwt', new JWTStrategy(jwtOptions, (payload: any, done: VerifiedCallback) => {
  Auth.findOne({ userId: payload.sub })
    .then((user: IAuthSchema | null) => {
      if(!user) return done(null, false)
      return done(null, user)
    })
    .catch((err) => {
      return done(err, false)
    })
}))

passport.use('local', new LocalStrategy(
  localOptions,
  (email: string, password: string, done: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void) => {
    Auth.findOne({ email })
      .then((auth: IAuthSchema | null) => {
        if(!auth) return done(null, false)
        if(!auth.compareHash(password)) return done(null, false)
        return done(null, auth)
      })
      .catch((err) => {
        return done(err, false)
      })
  }
))