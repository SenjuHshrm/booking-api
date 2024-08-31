import { Router, Request, Response } from 'express'
import { IPaymentInput } from './../../payment.interface'
import PaymentService from './../../payment.service'
import { encrypt } from './../../../../utils'

const putPaymentRoutes: Router = Router()
  .put('/set-as-default/:userId/:pmId', (req: Request, res: Response) => {
    return PaymentService.setAsDefaultPaymentMethod(res, req.params.userId, req.params.pmId)
  })
  

export default putPaymentRoutes