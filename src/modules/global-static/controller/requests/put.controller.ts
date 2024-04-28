import { Router, Request, Response } from "express";
import GlobalStaticService from '../../global-static.service'

const putGlobalStaticRoutes: Router = Router()
  .put('/update/static/:id', (req: Request, res: Response) => {
    return GlobalStaticService.updateStatic(res, req.params.id, req.body.values)
  })

export default putGlobalStaticRoutes