import { Request, Response, Router } from 'express'
import ReportService from './../../report.service'

const getReportRoutes: Router = Router()
  .get('/list/:page/:limit', (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return ReportService.getReportList(res, page, limit, <string>req.query.name)
  })

export default getReportRoutes