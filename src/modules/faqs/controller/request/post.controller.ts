import { Request, Response, Router } from 'express'
import FAQsService from './../../faqs.service'

const postFAQsRoutes: Router = Router()
  .post('/add', (req: Request, res: Response) => {
    return FAQsService.addFAQ(res, req.body)
  })

export default postFAQsRoutes