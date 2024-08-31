import { Schema, Types, model } from 'mongoose';
import { IPaymentMethodSchema } from '../payment.interface';

let pmSchema: Schema<IPaymentMethodSchema> = new Schema<IPaymentMethodSchema>({
  user: { type: Types.ObjectId, ref: 'user' },
  pmId: { type: String, required: true },
  isDefault: { type: Boolean, required: true },
}, {
  timestamps: true
})

const PaymentMethod = model('payment-method', pmSchema)

export default PaymentMethod