import { Router, Request, Response } from 'express';
import passport from 'passport';
import AuthService from '../../auth.service';

const postAuthRoutes: Router = Router()
  .post('/login', passport.authenticate('local', { session: false }), async (req: Request, res: Response) => {
    let resp: { res: boolean, msg: string } | null = await AuthService.checkStatus(req.user!, req.body.currentDate)
    if(resp === null) return res.status(500).json({ code: 'AUTH-0006' })
    if(!resp.res) return res.status(400).json({ msg: resp.msg })
    return AuthService.generateToken(res, req.user!)
  })

  .post('/login/google', (req: Request, res: Response) => {
    return AuthService.googleLogin(res, req.body.authData, req.body.userData)
  })

export default postAuthRoutes;