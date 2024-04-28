import { Router } from "express"
import { authRoutes } from './modules/auth/controller/auth.controller';
import { globalStaticRoutes } from "./modules/global-static/controller/global-static.controller";
import { staycationRoutes } from './modules/staycation/controller/staycation.controller';

export const Routes: Router = Router()
  .use('/auth', authRoutes)
  .use('/global-statics', globalStaticRoutes)
  .use('/staycation', staycationRoutes)