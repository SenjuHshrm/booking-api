import { Schema, model, Types } from 'mongoose'
import { IPaymentSchema } from '../payment.interface'

let PaymentSchema: Schema<IPaymentSchema> = new Schema<IPaymentSchema>({
  userId: { type: Types.ObjectId, ref: 'user' },
  clientId: { type: String, required: true }
}, {
  timestamps: true
})

const Payment = model('payment', PaymentSchema)

export default Payment