import { Router, Request, Response } from 'express'
import { IPaymentInput } from './../../payment.interface'
import PaymentService from './../../payment.service'
import { encrypt } from './../../../../utils'
import passport from 'passport'

const postPaymentRoutes: Router = Router()
  .post('/payment-process', (req: Request, res: Response) => {
    console.log(req.body.data)
    return res.sendStatus(200)
  })

  .post('/create-payment-intent', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return PaymentService.createPaymentIntent(res, req.body, req.user!)
  })

  .post('/attach-to-payment-intent/:piId', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return PaymentService.attachToPaymentIntent(res, req.body, req.params.piId)
  })
  

export default postPaymentRoutes