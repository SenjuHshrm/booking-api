import { Request, Response, Router } from 'express'
import ReportService from './../../report.service'

const postReportRoutes: Router = Router()
  .post('/add', (req: Request, res: Response) => {
    return ReportService.addReport(res, req.body)
  })

export default postReportRoutes