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
    arrivalDate: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    transaction: { type: Types.ObjectId, ref: "transaction" },
    isCancelled: { type: Boolean, required: true },
    cancellationPolicy: String,
    isApproved: Boolean,
    checkedIn: { type: Date, required: false },
    checkedOut: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

const Booking = model("booking", bookingSchema);

export default Booking;
