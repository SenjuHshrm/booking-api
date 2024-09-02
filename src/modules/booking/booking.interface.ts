import { PopulatedDoc } from 'mongoose';
import { Types, Document } from 'mongoose';

export interface IBookingSchema extends Document {
  initiatedBy: typeof Types.ObjectId; // user
  bookTo: typeof Types.ObjectId; // staycation
  arrivalDate: string;
  transaction: typeof Types.ObjectId | PopulatedDoc<any>; //transaction
  details: any;
  isCancelled: boolean;
  cancellationPolicy: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBooking {
  _id: string;
  initiatedBy: typeof Types.ObjectId; // user
  bookTo: typeof Types.ObjectId; // staycation
  arrivalDate: string;
  transaction: typeof Types.ObjectId | PopulatedDoc<any>; //transaction
  details: any;
  isCancelled: boolean;
  cancellationPolicy: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBookingInput {
  initiatedBy: string; // user
  bookTo: string; // staycation
  arrivalDate: string;
  details: any;
  isCancelled: boolean;
  cancellationPolicy: string;
  isApproved: boolean
}

export interface IBookingPayment {
  price: number;
  paymentDate: string;
  ref: string;
}
