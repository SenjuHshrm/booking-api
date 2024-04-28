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

export default getStaycationRoutes