import getReportRoutes from './requests/get.controller'
import postReportRoutes from './requests/post.controller'
import putReportRoutes from './requests/put.controller'
import { Router } from 'express'
import passport from 'passport'

const reportRoutes: Router = Router()
  .use('/get', passport.authenticate('jwt', { session: false }), getReportRoutes)
  .use('/post', passport.authenticate('jwt', { session: false }), postReportRoutes)
  .use('/put', passport.authenticate('jwt', { session: false }), putReportRoutes)

export default reportRoutes