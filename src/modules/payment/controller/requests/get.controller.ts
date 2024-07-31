import { Router, Request, Response } from 'express'
import PaymentService from '../../payment.service'


const getPaymentRoutes: Router = Router()
  .get('/payment-method/:id', (req: Request, res: Response) => {
    return PaymentService.getCustomerPaymentMethod(res, req.params.id)
  })

  .get('/merchant/payment-methods', (req: Request, res: Response) => {
    return PaymentService.getMerchantPaymentMethods(res)
  })

export default getPaymentRoutes