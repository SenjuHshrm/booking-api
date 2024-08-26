import { Request, Response, Router } from 'express'
import ImgCarouselService from './../../../img-carousel/img-carousel.service'
import passport from 'passport'

const getImgCarouselRoutes: Router = Router()
  .get('/list-all/:type/:page/:limit', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    if(req.params.type === 'front') {
      return ImgCarouselService.getImgFront(res, page, limit)
    }
    return ImgCarouselService.getImgLoc(res, page, limit)
  })

  .get('/list-active/:type', (req: Request, res: Response) => {
    if(req.params.type === 'front') {
      return ImgCarouselService.getActiveImgFront(res)
    }
    return ImgCarouselService.getActiveImgLoc(res)
  })

export default getImgCarouselRoutes