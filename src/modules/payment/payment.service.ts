import { IAuthSchema } from './../auth/auth.interface';
import { IUserInput, IUserSchema } from './../user/user.interface';
import User from './../user/schema/User.schema'
import { Response } from "express"
import PaymentMethod from './schema/PaymentMethod.schema'
import { IPaymentSchema, IPaymentInput, IPayment, IPaymentMethodSchema } from "./payment.interface"
import { logger, decrypt } from './../../utils'
import { env } from './../../config'
import Transaction from './schema/Transaction.schema';
import { ITransactionSchema } from './payment.interface';
import moment from 'moment';
import Booking from './../booking/schema/Booking.schema';

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
    // new Payment({
    //   userId,
    //   clientId: res.data.id
    // }).save()
    await User.findOneAndUpdate({ _id: userId }, { $set: { paymentClientId: res.data.id } }).exec()
  } catch(e: any) {
    logger('payment.controller', 'addCustomer', e.message, 'PYMT-0001')
  }
}

let getCustomerPaymentMethod = async (res: Response, user: string): Promise<Response> => {
  try {
    // let opt = {
    //   method: 'GET',
    //   headers: {
    //     accept: 'application/json',
    //     authorization: authBasic
    //   }
    // }
    // let payment: IPaymentSchema = <IPaymentSchema>(await Payment.findOne({ userId }).exec())
    // let req = await fetch(`${baseURL}/customers/${payment.clientId}/payment_methods`, opt)
    // let resp = await req.json()
    // return res.status(200).json(resp)
    let piList: IPaymentMethodSchema[] = <IPaymentMethodSchema[]>(await PaymentMethod.find({ user }).exec())
    return res.status(200).json(piList)
  } catch(e: any) {
    logger('payment.controller', 'getCustomerPaymentMethod', e.message, 'PYMT-0002')
    return res.status(500).json({ code: 'PYMT-0002' })
  }
}

let getMerchantPaymentMethods = async (res: Response): Promise<Response> => {
  try {
    // let opt = {
    //   method: 'GET',
    //   headers: {
    //     accept: 'application/json',
    //     authorization: authBasic
    //   }
    // }
    // let req = await fetch(`${baseURL}/merchants/capabilities/payment_methods`, opt)
    // let resp = await req.json()
    let resp = env.PAYMONGO_PAYMENT_METHODS
    return res.status(200).json(resp)
  } catch(e: any) {
    logger('payment.controller', 'getMerchantPaymentMethods', e.message, 'PYMT-0003')
    return res.status(500).json({ code: 'PYMT-0003' })
  }
}

let createPaymentIntent = async (res: Response, data: any, a: Express.User) => {
  try {
    console.log(data.amount * 100)
    let auth: IAuthSchema = <IAuthSchema>a;
    let user: IUserSchema = <IUserSchema>(await User.findById(auth.userId).exec())
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
            amount: data.amount * 100,
            payment_method_allowed: [data.paymentType],
            payment_method_options: (data.paymentType === 'card') ? {
              card: {
                request_three_d_secure: 'any'
              }
            } : null,
            currency: 'PHP',
            capture_type: 'automatic',
            // setup_future_usage: { session_type: 'on_session', customer_id: user.paymentClientId },
            description: `Booking ${data.staycationId}`,
            statement_descriptor: `Request booking of user ${user.id} for staycation ${data.staycationId}`,
            metadata: {
              userId: user.id,
              staycationId: data.staycationId
            }
          }
        }
      })
    }
    let reqt = await fetch(`${baseURL}/payment_intents`, opt)
    let resp = await reqt.json()
    console.log(resp)
    new Transaction({
      userId: user.id,
      staycationId: data.staycationId,
      piId: resp.data.id,
      amount: data.amount,
      paymentType: data.paymentOption,
      remainingBal: data.remainingBal,
      remainingBalDue: (data.remainingBalDue !== '') ? moment(data.remainingBalDue, "MMMM DD, YYYY").format('MM/DD/YYYY') : '',
      clientKey: resp.data.attributes.client_key,
      status: resp.data.attributes.status,
      checkoutURL: ''
    }).save()
    return res.status(201).json(resp)
  } catch(e: any) {
    logger('payment.controller', 'createPaymentIntent', e.message, 'PYMT-0004')
    return res.status(500).json({ code: 'PYMT-0004' })
  }
}

let attachToPaymentIntent = async (res: Response, data: any, piId: string) => {
  try {
    // let trn: ITransactionSchema = <ITransactionSchema>(await Transaction.findOne({ piId }).exec())
    // let opt = {
    //   method: 'POST',
    //   headers: {
    //     accept: 'application/json',
    //     'content-type': 'application/json',
    //     authorization: authBasic
    //   },
    //   body: JSON.stringify({
    //     data: {
    //       attributes: {
    //         payment_method: data.id,
    //         client_key: trn.clientKey,
    //         return_url: `${env.HOST}`
    //       }
    //     }
    //   })
    // }
    // let reqt = await fetch(`${baseURL}/payment_intents/${piId}/attach`, opt)
    // let resp = await reqt.json()
    // console.log(resp)
    // trn.checkoutURL = resp.data.attributes.next_action.redirect.url
    // trn.status = resp.data.attributes.status
    // trn.save()
    // new Booking({
    //   initiatedBy: trn.userId,
    //   bookTo: trn.staycationId,
    //   arrivalDate: data.checkInDate,
    //   transactionId: trn.id,
    //   isCancelled: false,
    //   cancellationPolicy: data.cancellationPolicy,
    //   isApproved: (data.bookingProcess === 'for_approval') ? false : true
    // }).save()
    // return res.status(200).json(resp)
    return res.status(200).json({})
  } catch(e: any) {
    logger('payment.controller', 'attachToPaymentIntent', e.message, 'PYMT-0005')
    return res.status(500).json({ code: 'PYMT-0005' })
  }
}

let savePaymentMethodId = async (res: Response, data: any): Promise<Response> => {
  try {
    new PaymentMethod({ user: data.userId, pmId: data.pmId, isDefault: false }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('payment.controller', 'savePaymentMethodId', e.message, 'PYMT-0006')
    return res.status(500).json({ code: 'PYMT-0006' })
  }
}

let setAsDefaultPaymentMethod = async (res: Response, userId: string, pmId: string): Promise<Response> => {
  try {
    await PaymentMethod.updateMany({ user: userId }, { $set: { isDefault: false } }).exec()
    await PaymentMethod.findByIdAndUpdate(pmId, { $set: { isDefault: true } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('payment.controller', 'setAsDefaultPaymentMethod', e.message, 'PYMT-0007')
    return res.status(500).json({ code: 'PYMT-0007' })
  }
}

let removePaymentMethod = async (res: Response, id: string): Promise<Response> => {
  try {
    await PaymentMethod.findByIdAndDelete(id).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('payment.controller', 'setAsDefaultPaymentMethod', e.message, 'PYMT-0008')
    return res.status(500).json({ code: 'PYMT-0008' })
  }
}

const PaymentService = {
  addCustomer,
  getCustomerPaymentMethod,
  getMerchantPaymentMethods,
  createPaymentIntent,
  attachToPaymentIntent,
  savePaymentMethodId,
  setAsDefaultPaymentMethod,
  removePaymentMethod
}

export default PaymentService