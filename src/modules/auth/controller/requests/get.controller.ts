import { Router, Request, Response } from "express";
import AuthService from "../../auth.service";
import passport from "passport";

const getAuthRoutes: Router = Router()
  .get('/request-token', (req: Request, res: Response) => {
    let token: string = <string>req.headers.authorization?.split(' ')[1]
    return AuthService.requestToken(res, token)
  })

  .get('/check-user', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return res.status(200).json({ isAuth: true })
  })

export default getAuthRoutes