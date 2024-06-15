import { Router, Request, Response } from 'express';
import StaycationService from '../../staycation.service';
import { IStaycationInput } from './../../staycation.interface';
import { uploadStaycationMedia } from '../../../../middleware';

const postStaycationRoutes: Router = Router()
  .post('/apply', uploadStaycationMedia.array('img'), (req: Request, res: Response) => {
    let imgs: { desc: string, filename: string }[] = JSON.parse(req.body.imgDesc)
    let prices = { ...JSON.parse(req.body.price) }
    let staycation: IStaycationInput = {
      host: req.body.host,
      name: req.body.name,
      serverDirName: req.body.serverDirName,
      descriptionFilter: JSON.parse(req.body.descriptionFilter),
      descriptionText: req.body.description,
      placeType: req.body.placeType,
      // location: { ...JSON.parse(req.body.location) },
      // location: { type: '', coordinates: [] },
      address: { ...JSON.parse(req.body.address), country: 'PH' },
      details: req.body.details,
      media: {
        cover: '',
        imgs: [],
      },
      amenities: JSON.parse(req.body.amenities),
      reservationConfirmation: req.body.reservationConfirmation,
      welcomingGuest: req.body.welcomingGuest,
      price: { common: prices.price, beforeTax: prices.beforeTax },
      // discounts: [ ...JSON.parse(req.body.discounts) ],
      discounts: req.body.discounts,
      security: [ ...JSON.parse(req.body.security) ],
    }
    let fileArrLn: number = imgs.length
    for(let i = 0; i < fileArrLn; i++) {
      let dir: string = `/staycation/${req.body.serverDirName}/${imgs[i].filename}`;
      (imgs[i].desc === 'cover') ? staycation.media.cover = dir : staycation.media.imgs.push(dir)
    }
    return StaycationService.applyProprietorship(res, staycation)
  })

export default postStaycationRoutes