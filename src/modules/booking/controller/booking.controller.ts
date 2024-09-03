import { Router } from "express";
import postBookingRoutes from "./request/post.controller";
import getBookingRoutes from "./request/get.controller";

const bookingRoutes: Router = Router()
  .use("/post", postBookingRoutes)
  .use("/get", getBookingRoutes);

export default bookingRoutes;
