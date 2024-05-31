import { Request, Response, Router } from 'express'
import passport from 'passport'
import UserService from './../../user.service'

const getUserRoutes: Router = Router()
  .get('/users/:access/:page/:limit', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return UserService.getUsersByAccess(res, req.params.access, page, limit)
  })

  .get('/proprietor-application/:page/:limit', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return UserService.getProprietorApplications(res, page, limit)
  })

export default getUserRoutes