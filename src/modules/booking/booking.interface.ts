import { Types, Document } from 'mongoose';

export interface IBookingSchema extends Document {
  initiatedBy: typeof Types.ObjectId; // user
  bookTo: typeof Types.ObjectId; // staycation
  arrivalDate: string;
  transactionId: typeof Types.ObjectId; //transaction
  isCancelled: boolean;
  cancellationPolicy: string;
  isApproved: boolean
}

export interface IBooking {
  initiatedBy: any; // user
  bookTo: any; // staycation
  arrivalDate: string;
  paymentType: string;
  payment: number;
  isCancelled: boolean;
}

export interface IBookingInput {
  initiatedBy: string; // user
  bookTo: string; // staycation
  arrivalDate: string;
  paymentType: string;
  payment: number;
  isCancelled: boolean;
  cancellationPolicy: string;
  isApproved: boolean
}

export interface IBookingPayment {
  price: number;
  paymentDate: string;
  ref: string;
}
