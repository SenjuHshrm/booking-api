import { Router, Request, Response } from "express";
import GlobalStaticService from '../../global-static.service'

const getGlobalStaticRoutes: Router = Router()
  .get('/statics/:id', (req: Request, res: Response) => {
    return GlobalStaticService.getStatic(res, req.params.id)
  })

export default getGlobalStaticRoutes