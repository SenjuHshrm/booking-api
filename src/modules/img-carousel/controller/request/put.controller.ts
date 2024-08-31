import { NextFunction, Request, Response, Router } from 'express'
import { uploadCarouselFrontImg, uploadCarouselLocImg } from './../../../../middleware'
import ImgCarouselService from './../../../img-carousel/img-carousel.service'

let mw = (req: Request, res: Response, next: NextFunction) => {
  if(req.params.type === 'front') {
    return uploadCarouselFrontImg.single('imgFile')(req, res, next)
  }
  return uploadCarouselLocImg.single('imgFile')(req, res, next)
}

const putImgCarouselRoutes: Router = Router()
  .put('/update/:type/:id', mw, (req: Request, res: Response) => {
    if(req.params.type === 'front') {
      return ImgCarouselService.updateImgFront(res, req.params.id, req.body)
    }
    return ImgCarouselService.updateImgLoc(res, req.params.id, req.body)
  })

export default putImgCarouselRoutes