import { Router } from "express"
import { authRoutes } from './modules/auth/auth.controller';
import { staycationRoutes } from './modules/staycation/staycation.controller';

export const Routes: Router = Router()
  .use('/auth', authRoutes)
  .use('/staycation', staycationRoutes)