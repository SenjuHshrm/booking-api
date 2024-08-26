import { Request, Response, Router } from 'express'
import ImgCarouselService from './../../../img-carousel/img-carousel.service'

const deleteImgCarouselRoutes: Router = Router()
  .delete('/:type/:id', (req: Request, res: Response) => {
    if(req.params.type === 'front') {
      return ImgCarouselService.deleteImgFront(res, req.params.id)
    }
    return ImgCarouselService.deleteImgLoc(res, req.params.id)
  })

export default deleteImgCarouselRoutes