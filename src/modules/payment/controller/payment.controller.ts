import { Router } from "express";
import passport from "passport";
import postPaymentRoutes from "./requests/post.controller";
import getPaymentRoutes from './requests/get.controller';
import putPaymentRoutes from "./requests/put.controller";
import deletePaymentRoutes from "./requests/delete.controller";

export const paymentRoutes: Router = Router()
  .use('/post', /**passport.authenticate('jwt', { session: false }),*/ postPaymentRoutes)
  .use('/get', passport.authenticate('jwt', { session: false }), getPaymentRoutes)
  .use('/put', /**passport.authenticate('jwt', { session: false }) */ putPaymentRoutes)
  .use('/delete', /**passport.authenticate('jwt', { session: false }) */ deletePaymentRoutes)