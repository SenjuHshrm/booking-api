import { Response } from "express"
import Payment from './schema/Payment.schema'
import { IPaymentSchema, IPaymentInput, IPayment } from "./payment.interface"
import { logger, decrypt } from './../../utils'

let addPayment = async (res: Response, payment: IPaymentInput): Promise<Response<null | { code: string }>> => {
  try {
    await new Payment(payment).save()
    return res.sendStatus(201)
  } catch(e: any) {
    logger('payment.controller', 'addPayment', e.message, 'PYM-0001')
    return res.status(500).json({ code: 'PYM-0001' })
  }
}

let getPaymentList = async (res: Response, userId: string): Promise<Response<IPayment[] | { code: string }>> => {
  try {
    let list: IPaymentSchema[] = <IPaymentSchema[]>(await Payment.find({ userId }).exec())
    let resp: IPayment[] = list.map((p: IPaymentSchema) => {
      return {
        _id: p.id,
        paymentType: p.paymentType,
        userId: p.userId.toString(),
        name: p.name,
        bankName: p.bankName,
        acctNum: (p.acctNum) ? decrypt(p.acctNum) : '',
        cardNum: (p.cardNum) ? decrypt(p.cardNum) : '',
        cvv: (p.cvv) ? decrypt(p.cvv) : '',
        createdAt: p.toJSON().createdAt,
        updatedAt: p.toJSON().updatedAt
      }
    })
    return res.status(200).json(resp)
  } catch(e: any) {
    logger('payment.controller', 'getPaymentList', e.message, 'PYM-0002')
    return res.status(500).json({ code: 'PYM-0002' })
  }
}

let getPaymentDetails = async(res: Response, _id: string): Promise<Response<IPayment | { code: string }>> => {
  try {
    let details: IPaymentSchema = <IPaymentSchema>(await Payment.findById(_id).exec())
    details.acctNum = (details.acctNum) ? decrypt(details.acctNum) : ''
    details.cardNum = (details.cardNum) ? decrypt(details.cardNum) : ''
    details.cvv = (details.cvv) ? decrypt(details.cvv) : ''
    return res.status(200).json(details)
  } catch(e: any) {
    logger('payment.controller', 'getPaymentDetails', e.message, 'PYM-0003')
    return res.status(500).json({ code: 'PYM-0003' })
  }
}

let updatePaymentDetails = async (res: Response, _id: string, data: IPaymentInput): Promise<Response<null | { code: string }>> => {
  try {
    await Payment.findByIdAndUpdate(_id, { $set: { ...data } }).exec()
    return res.sendStatus(200)
  } catch(e: any) {
    logger('payment.controller', 'updatePaymentDetails', e.message, 'PYM-0004')
    return res.status(500).json({ code: 'PYM-0004' })
  }
}

let removePaymentMethod = async (res: Response, _id: string): Promise<Response<null | { code: string }>> => {
  try {
    await Payment.findByIdAndDelete(_id).exec()
    return res.sendStatus(200)
  } catch(e: any) {
    logger('payment.controller', 'removePaymentMethod', e.message, 'PYM-0005')
    return res.status(500).json({ code: 'PYM-0005' })
  }
}

const PaymentService = {
  addPayment,
  getPaymentList,
  getPaymentDetails,
  updatePaymentDetails,
  removePaymentMethod
}

export default PaymentService