import { IImageCarouselFrontInput, IImageCarouselLocInput } from './../../img-carouse.interface';
import { uploadCarouselFrontImg, uploadCarouselLocImg } from './../../../../middleware';
import { Request, Response, Router, NextFunction } from 'express'
import ImgCarouselService from './../../../img-carousel/img-carousel.service'

let mw = (req: Request, res: Response, next: NextFunction) => {
  if(req.params.type === 'front') {
    return uploadCarouselFrontImg.single('imgFile')(req, res, next)
  }
  return uploadCarouselLocImg.single('imgFile')(req, res, next)
}

const postImgCarouselRoutes: Router = Router()
  .post('/add/:type', mw, (req: Request, res: Response) => {
    let data: IImageCarouselFrontInput | IImageCarouselLocInput
    if(req.params.type === 'front') {
      data = <IImageCarouselFrontInput> {
        img: `homepage/carousel-front/${req.body.img}`,
        isActive: req.body.isActive
      }
      return ImgCarouselService.addImgFront(res, <IImageCarouselFrontInput>data)
    }
    data = <IImageCarouselLocInput> {
      img: `homepage/carousel-location/${req.body.img}`,
      desc: req.body.desc,
      isActive: req.body.isActive
    }
    return ImgCarouselService.addImgLoc(res, <IImageCarouselLocInput>data)
  })

export default postImgCarouselRoutes