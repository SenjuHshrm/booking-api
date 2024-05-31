import { Router, Request, Response } from "express";
import GlobalStaticService from '../../global-static.service'

const getGlobalStaticRoutes: Router = Router()
  .get('/statics/:id', (req: Request, res: Response) => {
    return GlobalStaticService.getStatic(res, req.params.id)
  })

  .get('/statics/type/:type', (req: Request, res: Response) => {
    return GlobalStaticService.getStaticByType(res, req.params.type)
  })

export default getGlobalStaticRoutes