import { Router } from "express";
import passport from 'passport'
import postMessageRoutes from "./request/post.controller";
import getMessageRoutes from "./request/get.controller"

export const messageRoutes: Router = Router()
  .use('/post', passport.authenticate('jwt', { session: false }), postMessageRoutes)
  .use('/get', passport.authenticate('jwt', { session: false }), getMessageRoutes)