import { Router, Request, Response } from 'express';
import passport from 'passport';
import { uploadStaycationMedia } from '../../middleware';
import { IStaycationInput } from './staycation.interface';
import StaycationService from './staycation.service';

/**
 * @description /staycation child routes
 */
export const staycationRoutes: Router = Router()

  .post('/apply', passport.authenticate('jwt', { session: false }), uploadStaycationMedia.array('img'), (req: Request, res: Response) => {
    let imgs: { desc: string, filename: string }[] = JSON.parse(req.body.imgDesc)
    let staycation: IStaycationInput = {
      host: req.body.host,
      name: req.body.name,
      serverDirName: req.body.serverDirName,
      descriptionFilter: JSON.parse(req.body.descriptionFilter),
      descriptionText: req.body.description,
      placeType: req.body.placeType,
      location: { ...JSON.parse(req.body.location) },
      address: { ...JSON.parse(req.body.address) },
      details: req.body.details,
      media: {
        cover: '',
        imgs: [],
      },
      reservationConfirmation: req.body.reservationConfirmation,
      welcomingGuest: req.body.welcomingGuest,
      price: { ...JSON.parse(req.body.parse) },
      discounts: req.body.discounts,
      security: req.body.security,
    }
    let fileArrLn: number = imgs.length
    for(let i = 0; i < fileArrLn; i++) {
      let dir: string = `/staycation/${req.body.serverDirName}/${imgs[i].filename}`;
      (imgs[i].desc === 'cover') ? staycation.media.cover = dir : staycation.media.imgs.push(dir)
    }
    return StaycationService.applyProprietorship(res, staycation)
  })

  .get('/list/:page/:limit', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    let isListed: boolean = req.query.listed === 'true'
    return StaycationService.getListings(res, page, limit, isListed)
  })

  .put('/update/:id', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    
  })

  .put('/update-listing/:id/:list', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return StaycationService.updateListing(res, req.params.id, req.params.id === 'true')
  })

  .delete('/remove/:id', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return StaycationService.removeStaycation(res, req.params.id)
  })