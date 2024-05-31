import { Router, Request, Response } from 'express'
import PaymentService from './../../payment.service'

const deletePaymentRoutes: Router = Router()
  .delete('/:id', (req: Request, res: Response) => {
    return PaymentService.removePaymentMethod(res, req.params.id)
  })

export default deletePaymentRoutes
