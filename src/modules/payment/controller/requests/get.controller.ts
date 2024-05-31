import { Router, Request, Response } from 'express'
import PaymentService from '../../payment.service'
import { decrypt } from './../../../../utils'


const getPaymentRoutes: Router = Router()
  .get('/list/:id', (req: Request, res: Response) => {
    return PaymentService.getPaymentList(res, req.params.id)
  })

  .get('/details/:id', (req: Request, res: Response) => {
    return PaymentService.getPaymentDetails(res, req.params.id)
  })

export default getPaymentRoutes