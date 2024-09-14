import { Router } from 'express'
import getImgCarouselRoutes from './request/get.controller'
import postImgCarouselRoutes from './request/post.controller'
import putImgCarouselRoutes from './request/put.controller'
import deleteImgCarouselRoutes from './request/delete.controller'
import passport from 'passport'
import { csrf, csrfErrorHandler } from './../../../config'

const imgCarouselRoutes: Router = Router()
  .use('/get', getImgCarouselRoutes)
  .use('/post', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), postImgCarouselRoutes)
  .use('/put', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), putImgCarouselRoutes)
  .use('/delete', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), deleteImgCarouselRoutes)

export default imgCarouselRoutes