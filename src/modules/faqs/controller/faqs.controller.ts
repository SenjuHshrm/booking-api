import { Router } from 'express'
import getFAQsRoutes from './request/get.controller'
import postFAQsRoutes from './request/post.controller'
import putFAQsRoutes from './request/put.controller'
import deleteFAQsRoutes from './request/delete.controller'
import passport from 'passport'

const faqsRoutes: Router = Router()
  .use('/get', getFAQsRoutes)
  .use('/post', passport.authenticate('jwt', { session: false }), postFAQsRoutes)
  .use('/put', passport.authenticate('jwt', { session: false }), putFAQsRoutes)
  .use('/delete', passport.authenticate('jwt', { session: false }), deleteFAQsRoutes)

export default faqsRoutes