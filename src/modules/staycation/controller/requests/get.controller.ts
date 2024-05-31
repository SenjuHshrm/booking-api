import { Router, Request, Response } from 'express';
import passport from 'passport';
import StaycationService from '../../staycation.service';

const getStaycationRoutes: Router = Router()
  .get('/list/:page/:limit', (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    let isListed: boolean = req.query.listed === 'true'
    return StaycationService.getListings(res, page, limit, isListed)
  })

  .get('/host-list/:userId/:page/:limit', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return StaycationService.getHostListing(res, req.params.userId, page, limit)
  })

  .get('/details/:id', (req: Request, res: Response) => {
    return StaycationService.getDetails(res, req.params.id)
  })

  .get('/gallery/:id', (req: Request, res: Response) => {
    return StaycationService.getGallery(res, req.params.id)
  })

export default getStaycationRoutes