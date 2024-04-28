import { Router, Request, Response } from "express";
import AuthService from "../../auth.service";

const getAuthRoutes: Router = Router()
  .get('/request-token', (req: Request, res: Response) => {
    let token: string = <string>req.headers.authorization?.split(' ')[1]
    return AuthService.requestToken(res, token)
  })

export default getAuthRoutes