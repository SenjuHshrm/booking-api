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
  paymentType: { type: String, required: true },
  payment: [bookingPaymentSchema],
  isPaid: { type: Boolean, required: true },
  isCancelled: { type: Boolean, required: true }
}, {
  timestamps: true
})

const Booking = model('booking', bookingSchema)

export default Booking