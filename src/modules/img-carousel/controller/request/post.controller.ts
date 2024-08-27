import { uploadCarouselFrontImg, uploadCarouselLocImg } from './../../../../middleware';
import { Request, Response, Router, NextFunction } from 'express'
import ImgCarouselService from './../../../img-carousel/img-carousel.service'

let mw = (req: Request, res: Response, next: NextFunction) => {
  if(req.params.type === 'front') {
    uploadCarouselFrontImg.single('imgFile')
    return next()
  }
  uploadCarouselLocImg.single('imgFile')
  return next()
}

const postImgCarouselRoutes: Router = Router()
  .post('/add/:type', mw, (req: Request, res: Response) => {
    if(req.params.type === 'front') {
      return ImgCarouselService.addImgFront(res, req.body)
    }
    return ImgCarouselService.addImgLoc(res, req.body)
  })

export default postImgCarouselRoutes