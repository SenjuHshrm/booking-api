import { Request, Response, Router } from 'express'
import ReportService from './../../report.service'

const putReportRoutes: Router = Router()
  .post('/set-action/:id', (req: Request, res: Response) => {
    return ReportService.setReportAction(res, req.params.id, req.body.action)
  })

export default putReportRoutes