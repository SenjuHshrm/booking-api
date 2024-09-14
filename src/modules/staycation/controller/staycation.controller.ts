import { Router } from 'express';
import passport from 'passport';
import getStaycationRoutes from './requests/get.controller';
import postStaycationRoutes from './requests/post.controller';
import putStaycationRoutes from './requests/put.controller';
import deleteStaycationRoutes from './requests/delete.controller';
import { csrf, csrfErrorHandler } from './../../../config'

export const staycationRoutes: Router = Router()
  .use('/get', getStaycationRoutes)
  .use('/post', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), postStaycationRoutes)
  .use('/put', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), putStaycationRoutes)
  .use('/delete', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), deleteStaycationRoutes)
  

  

  

  