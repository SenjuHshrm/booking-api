import { Request, Response, Router } from 'express'
import FAQsService from './../../faqs.service'

const putFAQsRoutes: Router = Router()
  .put('/update/:id', (req: Request, res: Response) => {
    return FAQsService.updateFAQ(res, req.params.id, req.body)
  })

export default putFAQsRoutes