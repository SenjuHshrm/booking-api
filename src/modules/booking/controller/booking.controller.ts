import { Router } from "express";
import postBookingRoutes from "./request/post.controller";
import getBookingRoutes from "./request/get.controller";
import passport from "passport";
import { csrf, csrfErrorHandler } from './../../../config'

const bookingRoutes: Router = Router()
  .use("/post", csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), postBookingRoutes)
  .use("/get", passport.authenticate('jwt', { session: false }), getBookingRoutes);

export default bookingRoutes;
