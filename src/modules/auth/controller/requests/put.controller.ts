import { Router, Request, Response } from 'express';
import passport from 'passport';
import AuthService from '../../auth.service';

const putAuthRoutes: Router = Router()
  .put('/update-password/:id', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return AuthService.updatePassword(res, req.params.id, req.body.password)
  })

export default putAuthRoutes