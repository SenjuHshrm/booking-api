import { Router, Request, Response } from 'express';
import StaycationService from '../../staycation.service';

const putStaycationRoutes: Router = Router()
  .put('/update/:id', (req: Request, res: Response) => {
    return StaycationService.updateStaycation(res, req.params.id, req.body)
  })

  .put('/update-from-admin/:id', (req: Request, res: Response) => {
    return StaycationService.updateStaycationFromAdmin(res, req.params.id, req.body)
  })

  .put('/update-listing/:id',(req: Request, res: Response) => {
    return StaycationService.updateListing(res, req.params.id, req.body.isListed)
  })

export default putStaycationRoutes