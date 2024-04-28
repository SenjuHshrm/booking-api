import { Router, Request, Response } from 'express';
import passport from 'passport';
import AuthService from '../../auth.service';

const postAuthRoutes: Router = Router()
  .post('/login', passport.authenticate('local', { session: false }), (req: Request, res: Response) => {
    return AuthService.generateToken(res, req.user!)
  })

export default postAuthRoutes;