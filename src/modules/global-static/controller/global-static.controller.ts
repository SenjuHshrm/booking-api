import { Router } from "express";
import passport from "passport";
import deleteGlobalStaticRoutes from "./requests/delete.controller";
import getGlobalStaticRoutes from "./requests/get.controller";
import postGlobalStaticRoutes from "./requests/post.controller";
import putGlobalStaticRoutes from "./requests/put.controller";
import { csrf, csrfErrorHandler } from './../../../config'

export const globalStaticRoutes: Router = Router()
  .use('/get', /** passport.authenticate('jwt', { session: false }),*/ getGlobalStaticRoutes)
  .use('/post', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), postGlobalStaticRoutes)
  .use('/put', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), putGlobalStaticRoutes)
  .use('/delete', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), deleteGlobalStaticRoutes)