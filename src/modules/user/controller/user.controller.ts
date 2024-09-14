import { Router } from 'express';
import passport from 'passport';
import getUserRoutes from './requests/get.controller';
import postUserRoutes from './requests/post.controller';
import putUserRoutes from './requests/put.controller';
import deleteUserRoutes from './requests/delete.controller';
import { csrf, csrfErrorHandler } from './../../../config'

export const userRoutes: Router = Router()
  .use('/get', getUserRoutes)
  .use('/post', csrf.doubleCsrfProtection, csrfErrorHandler, postUserRoutes)
  .use('/put', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), putUserRoutes)
  .use('/delete', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), deleteUserRoutes)