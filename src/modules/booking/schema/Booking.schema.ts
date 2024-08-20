import { model, Types, Schema } from 'mongoose'
import { IBookingSchema, IBookingPayment } from '../booking.interface'

let bookingPaymentSchema: Schema<IBookingPayment> = new Schema<IBookingPayment>({
  price: Number,
  paymentDate: String,
  ref: String
});

let bookingSchema: Schema<IBookingSchema> = new Schema<IBookingSchema>({
  initiatedBy: { type: Types.ObjectId, ref: 'user' },
  bookTo: { type: Types.ObjectId, ref: 'staycation' },
  arrivalDate: { type: String, required: true },
  transactionId: { type: Types.ObjectId, ref: 'transaction' },
  isCancelled: { type: Boolean, required: true },
  cancellationPolicy: String,
  isApproved: Boolean
}, {
  timestamps: true
})

const Booking = model('booking', bookingSchema)

export default Booking