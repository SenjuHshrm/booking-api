import { Router, Request, Response } from 'express'
import { IPaymentInput } from './../../payment.interface'
import PaymentService from './../../payment.service'
import { encrypt } from './../../../../utils'

const putPaymentRoutes: Router = Router()
  

export default putPaymentRoutes