import getReportRoutes from './requests/get.controller'
import postReportRoutes from './requests/post.controller'
import putReportRoutes from './requests/put.controller'
import { Router } from 'express'
import passport from 'passport'
import { csrf, csrfErrorHandler } from './../../../config'

const reportRoutes: Router = Router()
  .use('/get', passport.authenticate('jwt', { session: false }), getReportRoutes)
  .use('/post', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), postReportRoutes)
  .use('/put', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), putReportRoutes)

export default reportRoutes