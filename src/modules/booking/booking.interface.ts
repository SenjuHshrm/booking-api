import { IUserPrev } from "modules/user/user.interface";
import { PopulatedDoc } from "mongoose";
import { Types, Document } from "mongoose";

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface IBookingSchema extends Document {
  initiatedBy: typeof Types.ObjectId; // user
  bookTo: typeof Types.ObjectId; // staycation
  duration: {
    start: string;
    end: string;
  };
  transaction: typeof Types.ObjectId | PopulatedDoc<any>; //transaction
  details: any;
  isCancelled: boolean;
  cancellationPolicy: string;
  status: 'for_approval' | 'upcoming' | 'arriving' | 'current_guest' | 'check_out' | 'cancelled';
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBookingGuestSchema extends Document {
  booking: typeof Types.ObjectId | PopulatedDoc<any>;
  name: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
}

// export interface IBookingCancellation extends Document {
//   booking: typeof Types.ObjectId | PopulatedDoc<any>;
//   reason: string;
//   status: 'pending' | 'cancelled';
//   createdAt: string;
//   updatedAt: string;
// }

export interface IBookingCancellationSchema extends Document {
  booking: typeof Types.ObjectId | PopulatedDoc<any>;
  reason: string;
  status: 'pending' | 'cancelled';
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
  isApproved: boolean;
}

export interface IBookingPayment {
  price: number;
  paymentDate: string;
  ref: string;
}
