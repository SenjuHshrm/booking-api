import { Router, Request, Response } from 'express';
import passport from 'passport';
import AuthService from '../../auth.service';
import { csrf, csrfErrorHandler } from './../../../../config'

const putAuthRoutes: Router = Router()
  .put('/update-password/:id', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return AuthService.updatePassword(res, req.params.id, req.body.password)
  })

export default putAuthRoutes