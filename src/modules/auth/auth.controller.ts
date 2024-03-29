import { Router, Request, Response } from 'express';
import passport from 'passport';
import AuthService from './auth.service'

/**
 * @description /auth child routes
 */
export const authRoutes: Router = Router()

  .get('/request-token', (req: Request, res: Response) => {
    let token: string = <string>req.headers.authorization?.split(' ')[1]
    return AuthService.requestToken(res, token)
  })

  .post('/login', passport.authenticate('local', { session: false }), (req: Request, res: Response) => {
    return AuthService.generateToken(res, req.user!)
  })
  
  .delete('/logout', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let token: string = <string>req.headers.authorization?.split(' ')[1]
    return AuthService.logout(res, req.user!, token)
  })