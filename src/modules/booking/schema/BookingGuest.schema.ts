import { model, Types, Schema } from "mongoose";
import { IBookingGuestSchema } from '../booking.interface'

let bookingGuest: Schema<IBookingGuestSchema> = new Schema<IBookingGuestSchema>({
  booking: { type: Types.ObjectId, ref: 'booking' },
  name: { type: String, required: true },
  checkInDate: String,
  checkInTime: String,
  checkOutDate: String,
  checkOutTime: String
})

const BookingGuest = model('booking-guest', bookingGuest)

export default BookingGuest