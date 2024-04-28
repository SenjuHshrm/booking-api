import { Router, Request, Response } from 'express';
import StaycationService from '../../staycation.service';

const deleteStaycationRoutes: Router = Router()
  .delete('/remove/:id', (req: Request, res: Response) => {
    return StaycationService.removeStaycation(res, req.params.id)
  })

export default deleteStaycationRoutes