import { model, Schema, Types } from 'mongoose'
import { IBookingCancellationSchema } from '../booking.interface'

let bookCancelSchema: Schema<IBookingCancellationSchema> = new Schema<IBookingCancellationSchema>({
  booking: { type: Types.ObjectId, ref: 'booking' },
  reason: String,
  status: { type: String, enum: { values: ['pending', 'cancelled'] } }
}, {
  timestamps: true
})

const BookingCancellation = model('booking-cancellation', bookCancelSchema)

export default BookingCancellation