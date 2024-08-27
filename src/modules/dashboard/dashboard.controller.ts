import { Request, Response, Router } from 'express'
import passport from 'passport'
import DashboardService from './dashboard.service'

const dashboardRoutes: Router = Router()
  .get('/users', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return DashboardService.getAllUserCounts(res)
  })