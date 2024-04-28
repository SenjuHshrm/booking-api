import { Router } from 'express';
import passport from 'passport';
import getStaycationRoutes from './requests/get.controller';
import postStaycationRoutes from './requests/post.controller';
import putStaycationRoutes from './requests/put.controller';
import deleteStaycationRoutes from './requests/delete.controller';

export const staycationRoutes: Router = Router()
  .use('/get', passport.authenticate('jwt', { session: false }), getStaycationRoutes)
  .use('/post', passport.authenticate('jwt', { session: false }), postStaycationRoutes)
  .use('/put', passport.authenticate('jwt', { session: false }), putStaycationRoutes)
  .use('/delete', passport.authenticate('jwt', { session: false }), deleteStaycationRoutes)
  

  

  

  