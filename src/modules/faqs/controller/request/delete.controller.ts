import { Request, Response, Router } from 'express'
import FAQsService from './../../faqs.service'

const deleteFAQsRoutes: Router = Router()
  .delete('/remove/:id', (req: Request, res: Response) => {
    return FAQsService.deleteFAQ(res, req.params.id)
  })

export default deleteFAQsRoutes