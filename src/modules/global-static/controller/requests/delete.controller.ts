import { Router, Request, Response } from "express";
import GlobalStaticService from '../../global-static.service'

const deleteGlobalStaticRoutes: Router = Router()
  .delete('/static/:type', (req: Request, res: Response) => {
    return GlobalStaticService.deleteValueFromStatic(res, req.params.type, req.body)
  })

export default deleteGlobalStaticRoutes