import { Schema, model, Types } from 'mongoose'
import { IPaymentSchema, EPaymentType } from '../payment.interface'

let PaymentSchema: Schema<IPaymentSchema> = new Schema<IPaymentSchema>({
  paymentType: { type: String, enum: { values: Object.keys(EPaymentType) } },
  userId: { type: Types.ObjectId, ref: 'user' },
  name: { type: String, required: true },
  bankName: { type: String, required: true },
  acctNum: String,
  cardNum: String,
  cvv: String
})

const Payment = model('payment', PaymentSchema)

export default Payment