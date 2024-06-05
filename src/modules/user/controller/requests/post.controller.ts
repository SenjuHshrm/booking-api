import { profileImgStorageMedia } from './../../../../middleware';
import { Request, Response, Router } from 'express';
import UserService from '../../user.service';
import passport from 'passport';

const postUserRoutes: Router = Router()
  .post('/add', (req: Request, res: Response) => {
    return UserService.register(res, req.body)
  })

  .post('/add/admin', passport.authenticate('jwt', { session: false }), profileImgStorageMedia.single('img'), (req: Request, res: Response) => {
    let user = {
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      password: req.body.password,
      imgFile: `/profile-img/${req.body.email}/${req.file?.originalname}`
    }
    return UserService.addAdmin(res, user)
  })

export default postUserRoutes