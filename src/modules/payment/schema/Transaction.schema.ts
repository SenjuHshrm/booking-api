import { Types, model, Schema } from 'mongoose'
import { ITransactionSchema } from '../payment.interface'

const transactionSchema: Schema<ITransactionSchema> =  new Schema<ITransactionSchema>({
  userId: { type: Types.ObjectId, ref: 'user' },
  staycationId: { type: Types.ObjectId, ref: 'staycation' },
  piId: String,
  amount: Number,
  paymentType: { type: String, enum: { values: ['full', 'downpayment'] } },
  remainingBal: Number,
  remainingBalDue: String,
  clientKey: String,
  status: String,
  checkoutURL: String
}, {
  timestamps: true
})

const Transaction = model('transaction', transactionSchema)

export default Transaction;