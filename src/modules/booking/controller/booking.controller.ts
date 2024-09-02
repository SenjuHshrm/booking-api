import { Router } from 'express'
import postBookingRoutes from './request/post.controller'

const bookingRoutes: Router = Router()
  .use('/post', postBookingRoutes)

export default bookingRoutes