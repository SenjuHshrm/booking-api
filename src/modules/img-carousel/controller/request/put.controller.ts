import { NextFunction, Request, Response, Router } from 'express'
import { uploadCarouselFrontImg, uploadCarouselLocImg } from './../../../../middleware'
import ImgCarouselService from './../../../img-carousel/img-carousel.service'

let mw = (req: Request, res: Response, next: NextFunction) => {
  if(req.params.type === 'front') {
    uploadCarouselFrontImg.single('imgFile')
    return next()
  }
  uploadCarouselLocImg.single('imgFile')
  return next()
}

const putImgCarouselRoutes: Router = Router()
  .put('/update/:type/:id', mw, (req: Request, res: Response) => {
    if(req.params.type === 'front') {
      return ImgCarouselService.updateImgFront(res, req.params.id, req.body)
    }
    return ImgCarouselService.updateImgLoc(res, req.params.id, req.body)
  })

export default putImgCarouselRoutes