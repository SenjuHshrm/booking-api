import { Request, Response, Router } from 'express';
import UserService from '../../user.service';

const postUserRoutes: Router = Router()
  .post('/add', (req: Request, res: Response) => {
    return UserService.register(res, req.body)
  })

export default postUserRoutes