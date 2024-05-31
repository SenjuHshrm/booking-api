import { Router, Request, Response } from 'express'
import { IPaymentInput } from './../../payment.interface'
import PaymentService from './../../payment.service'
import { encrypt } from './../../../../utils'

const postPaymentRoutes: Router = Router()
  .post('/add', (req: Request, res: Response) => {
    let paymentEncrypted: IPaymentInput = {
      ...req.body,
      acctNum: (req.body.acctNum) ? encrypt(<string>req.body.acctNum) : '',
      cardNum: (req.body.cardNum) ? encrypt(<string>req.body.cardNum) : '',
      cvv: (req.body.cvv) ? encrypt(<string>req.body.cvv) : ''
    }
    return PaymentService.addPayment(res, paymentEncrypted)
  })

export default postPaymentRoutes