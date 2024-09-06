import { Router, Request, Response } from 'express';
import StaycationService from '../../staycation.service';
import { IReviewInput, IStaycationInput } from './../../staycation.interface';
import { uploadStaycationMedia, uploadReviewMedia } from '../../../../middleware';

const postStaycationRoutes: Router = Router()
  .post('/apply', uploadStaycationMedia.fields([{ name: 'genImg' }, { name: 'bedroom' }]), (req: Request, res: Response) => {
    let discount = JSON.parse(req.body.discounts)
    let genImg = JSON.parse(req.body.genImgList)
    let bedroom = JSON.parse(req.body.bedroomList)
    let staycation: IStaycationInput = {
      host: req.body.host,
      descriptionFilter: req.body.descriptionFilter,
      placeType: req.body.placeType,
      maxBooking: parseInt(req.body.maxBooking),
      address: { ...JSON.parse(req.body.address), country: 'PH' },
      landmark: req.body.landmark,
      location: '',
      details: JSON.parse(req.body.details),
      amenities: JSON.parse(req.body.amenities),
      name: req.body.name,
      descriptionText: JSON.parse(req.body.descriptionText),
      detailedDescription: req.body.detailedDescription,
      discounts: {
        discounts: discount.discounts,
        value: parseInt(discount.value)
      },
      security: JSON.parse(req.body.security),
      price: parseInt(req.body.price),
      cancellationPolicy: JSON.parse(req.body.cancellationPolicy),
      houseRules: JSON.parse(req.body.houseRules),
      houseRulesDetailed: req.body.houseRulesDetailed,
      bookingProcess: req.body.bookingProcess,
      genImgList: genImg.map((gi: string) => `/staycation/${req.body.serverDirName}/gen-img/${gi}`),
      cover: '',
      bedroomList: bedroom.map((br: string) => `/staycation/${req.body.serverDirName}/bedroom/${br}`),
      isListed: false,
      isApproved: false
    }
    return StaycationService.applyProprietorship(res, staycation)
  })
  
  .post('/review-staycation/:staycationId', uploadReviewMedia.array('media'), (req: Request, res: Response) => {
    let media: string[] = []
    let imgs: Express.Multer.File[] = <Express.Multer.File[]>req.files;
    for(let i = 0; i < imgs.length; i++) {
      media.push(`/staycation/${req.body.serverDirName}/reviews/${imgs[i].originalname}`)
    }
    let data: IReviewInput = {
      staycation: req.params.staycationId,
      user: req.body.user,
      rating: parseInt(req.body.rating),
      comment: req.body.comment,
      media
    }
    return StaycationService.reviewStaycation(res, data)
  })

export default postStaycationRoutes