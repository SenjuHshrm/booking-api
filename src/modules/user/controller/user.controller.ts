import { Router } from 'express';
import passport from 'passport';
import getUserRoutes from './requests/get.controller';
import postUserRoutes from './requests/post.controller';
import putUserRoutes from './requests/put.controller';
import deleteUserRoutes from './requests/delete.controller';

export const userRoutes: Router = Router()
  .use('/get', getUserRoutes)
  .use('/post', postUserRoutes)
  .use('/put', passport.authenticate('jwt', { session: false }), putUserRoutes)
  .use('/delete', passport.authenticate('jwt', { session: false }), deleteUserRoutes)