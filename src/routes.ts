import { Router } from "express"
import { authRoutes } from './modules/auth/controller/auth.controller';
import { globalStaticRoutes } from "./modules/global-static/controller/global-static.controller";
import { staycationRoutes } from './modules/staycation/controller/staycation.controller';
import { paymentRoutes } from "./modules/payment/controller/payment.controller";
import { userRoutes } from './modules/user/controller/user.controller'
import { messageRoutes } from './modules/message/controller/message.controller';
import faqsRoutes from "./modules/faqs/controller/faqs.controller";
import reportRoutes from "./modules/report/controller/report.controller";
import imgCarouselRoutes from "./modules/img-carousel/controller/img-carousel.controller";
import bookingRoutes from './modules/booking/controller/booking.controller'

export const Routes: Router = Router()
  .use('/auth', authRoutes)
  .use('/global-statics', globalStaticRoutes)
  .use('/staycation', staycationRoutes)
  .use('/payment', paymentRoutes)
  .use('/user', userRoutes)
  .use('/message', messageRoutes)
  .use('/faqs', faqsRoutes)
  .use('/report', reportRoutes)
  .use('/img-carousel', imgCarouselRoutes)
  .use('/booking', bookingRoutes)