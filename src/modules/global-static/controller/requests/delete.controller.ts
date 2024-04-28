import { Router, Request, Response } from "express";
import GlobalStaticService from '../../global-static.service'

const deleteGlobalStaticRoutes: Router = Router()
  .put('/static/:id', (req: Request, res: Response) => {
    return GlobalStaticService.deleteStatic(res, req.params.id)
  })

export default deleteGlobalStaticRoutes