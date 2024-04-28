import { Router, Request, Response } from "express";
import GlobalStaticService from '../../global-static.service'

const postGlobalStaticRoutes: Router = Router()
  .post('/add-static', (req: Request, res: Response) => {
    return GlobalStaticService.addStatic(res, req.body.type, req.body.values)
  })

export default postGlobalStaticRoutes