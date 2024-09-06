import { Types, model, Schema } from 'mongoose'
import { ITransactionSchema } from '../payment.interface'

let trnHistory = new Schema({
  clientKey: String,
  amount: Number,
  datePaid: String,
  checkoutURL: String
})

const transactionSchema: Schema<ITransactionSchema> =  new Schema<ITransactionSchema>({
  userId: { type: Types.ObjectId, ref: 'user' },
  staycationId: { type: Types.ObjectId, ref: 'staycation' },
  total: Number,
  paymentType: { type: String, enum: { values: ['full', 'downpayment'] } },
  history: [trnHistory],
  status: { type: String, enum: { values: ['pending', 'paid'] } }
}, {
  timestamps: true
})

const Transaction = model('transaction', transactionSchema)

export default Transaction;