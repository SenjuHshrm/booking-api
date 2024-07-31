import { IUserInput } from './../user/user.interface';
import { Response } from "express"
import Payment from './schema/Payment.schema'
import { IPaymentSchema, IPaymentInput, IPayment } from "./payment.interface"
import { logger, decrypt } from './../../utils'
import { env } from './../../config'

const authBasic: string = `Basic ${Buffer.from(env.PAYMONGO_SK + ':').toString('base64')}`
const baseURL: string = `${env.PAYMONGO_URL}/${env.PAYMONGO_URL_VER}`

let addCustomer = async (userId: string, data: IUserInput, contact: string) => {
  try {
    let opt = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: authBasic
      },
      body: JSON.stringify({
        data: {
          attributes: {
            first_name: data.fName,
            last_name: data.lName,
            phone: contact,
            email: data.email,
            default_device: 'email'
          }
        }
      })
    }
    let req = await fetch(`${baseURL}/customers`, opt)
    let res = await req.json()
    new Payment({
      userId,
      clientId: res.data.id
    }).save()
  } catch(e: any) {
    logger('payment.controller', 'addCustomer', e.message, 'PYMT-0001')
  }
}

let getCustomerPaymentMethod = async (res: Response, userId: string): Promise<Response> => {
  try {
    let opt = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: authBasic
      }
    }
    let payment: IPaymentSchema = <IPaymentSchema>(await Payment.findOne({ userId }).exec())
    let req = await fetch(`${baseURL}/customers/${payment.clientId}/payment_methods`, opt)
    let resp = await req.json()
    return res.status(200).json(resp)
  } catch(e: any) {
    logger('payment.controller', 'getCustomerPaymentMethod', e.message, 'PYMT-0002')
    return res.status(500).json({ code: 'PYMT-0002' })
  }
}

let getMerchantPaymentMethods = async (res: Response): Promise<Response> => {
  try {
    let opt = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: authBasic
      }
    }
    let req = await fetch(`${baseURL}/merchants/capabilities/payment_methods`, opt)
    let resp = await req.json()
    return res.status(200).json(resp)
  } catch(e: any) {
    logger('payment.controller', 'getMerchantPaymentMethods', e.message, 'PYMT-0003')
    return res.status(500).json({ code: 'PYMT-0003' })
  }
}

const PaymentService = {
  addCustomer,
  getCustomerPaymentMethod,
  getMerchantPaymentMethods
}

export default PaymentService