import { Request, Response, Router } from 'express'
import FAQsService from './../../faqs.service'
import passport from 'passport'
import { csrf, csrfErrorHandler } from './../../../../config'

const getFAQsRoutes: Router = Router()
  .get('/list/:page/:limit', csrf.doubleCsrfProtection, csrfErrorHandler, passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return FAQsService.getFAQs(res, page, limit)
  })

  .get('/list/active', (req: Request, res: Response) => {
    return FAQsService.getActiveFAQs(res)
  })

export default getFAQsRoutes