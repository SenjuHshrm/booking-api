import { Router, Request, Response } from 'express';
import passport from 'passport';
import AuthService from '../../auth.service';

const deleteAuthRoutes: Router = Router()
  .delete('/logout', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let token: string = <string>req.headers.authorization?.split(' ')[1]
    return AuthService.logout(res, req.user!, token)
  })

export default deleteAuthRoutes