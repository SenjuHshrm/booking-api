import { Types, Document } from 'mongoose';

export interface IBookingSchema extends Document {
  initiatedBy: typeof Types.ObjectId; // user
  bookTo: typeof Types.ObjectId; // staycation
  arrivalDate: string;
  paymentType: string;
  payment: IBookingPayment[];
  isPaid: boolean;
  isCancelled: boolean;
}

export interface IBooking {
  initiatedBy: any; // user
  bookTo: any; // staycation
  arrivalDate: string;
  paymentType: string;
  payment: number;
  isPaid: boolean;
  isCancelled: boolean;
}

export interface IBookingInput {
  initiatedBy: string; // user
  bookTo: string; // staycation
  arrivalDate: string;
  paymentType: string;
  payment: number;
  isPaid: boolean;
  isCancelled: boolean;
}

export interface IBookingPayment {
  price: number;
  paymentDate: string;
  ref: string;
}
