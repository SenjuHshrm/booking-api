import { Router } from 'express';
import deleteAuthRoutes from './requests/delete.controller';
import getAuthRoutes from './requests/get.controller';
import postAuthRoutes from './requests/post.controller';
import putAuthRoutes from './requests/put.controller';

export const authRoutes: Router = Router()
  .use('/get', getAuthRoutes)
  .use('/post', postAuthRoutes)
  .use('/delete', deleteAuthRoutes)
  .use('/put', putAuthRoutes)

  

  
  
  