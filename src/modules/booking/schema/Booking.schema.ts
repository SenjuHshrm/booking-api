import { model, Types, Schema } from "mongoose";
import { IBookingSchema, IBookingPayment } from "../booking.interface";

let bookingPaymentSchema: Schema<IBookingPayment> = new Schema<IBookingPayment>(
  {
    price: Number,
    paymentDate: String,
    ref: String,
  }
);

let bookingSchema: Schema<IBookingSchema> = new Schema<IBookingSchema>(
  {
    initiatedBy: { type: Types.ObjectId, ref: "user" },
    bookTo: { type: Types.ObjectId, ref: "staycation" },
    duration: {
      start: String,
      end: String
    },
    transaction: { type: Types.ObjectId, ref: "transaction" },
    details: { type: Schema.Types.Mixed },
    isCancelled: { type: Boolean, required: true },
    cancellationPolicy: String,
    status: { type: String, enum: { values: ['for_approval', 'upcoming', 'arriving', 'current_guest', 'check_out', 'cancelled'] } },
    checkInDate: String,
    checkInTime: String,
    checkOutDate: String,
    checkOutTime: String
  },
  {
    timestamps: true,
  }
);

const Booking = model("booking", bookingSchema);

export default Booking;
