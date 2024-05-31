import { Request, Response, Router } from 'express'
import UserService from '../../user.service'

const putUserRoutes: Router = Router()
  .put('/set-as-host/:propAppId', (req: Request, res: Response) => {
    return UserService.setAsProprietor(res, req.body.userId, req.body.staycationId, req.params.propAppId)
  })

export default putUserRoutes