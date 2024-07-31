import { Router, Request, Response } from 'express'
import { IPaymentInput } from './../../payment.interface'
import PaymentService from './../../payment.service'
import { encrypt } from './../../../../utils'

const postPaymentRoutes: Router = Router()
  

export default postPaymentRoutes