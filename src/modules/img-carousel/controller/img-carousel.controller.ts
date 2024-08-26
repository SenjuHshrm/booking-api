import { Router } from 'express'
import getImgCarouselRoutes from './request/get.controller'
import postImgCarouselRoutes from './request/post.controller'
import putImgCarouselRoutes from './request/put.controller'
import deleteImgCarouselRoutes from './request/delete.controller'
import passport from 'passport'

const imgCarouselRoutes: Router = Router()
  .use('/get', getImgCarouselRoutes)
  .use('/post', passport.authenticate('jwt', { session: false }), postImgCarouselRoutes)
  .use('/put', passport.authenticate('jwt', { session: false }), putImgCarouselRoutes)
  .use('/delete', passport.authenticate('jwt', { session: false }), deleteImgCarouselRoutes)

export default imgCarouselRoutes