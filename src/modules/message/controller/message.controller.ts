import { Router } from "express";
import passport from 'passport'
import postMessageRoutes from "./request/post.controller";
import getMessageRoutes from "./request/get.controller"
import { csrf, csrfErrorHandler } from './../../../config'

export const messageRoutes: Router = Router()
  .use('/post', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), postMessageRoutes)
  .use('/get', passport.authenticate('jwt', { session: false }), getMessageRoutes)