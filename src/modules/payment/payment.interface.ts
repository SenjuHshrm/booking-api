import { IUserPrev } from "./../user/user.interface";
import { Document, Types, PopulatedDoc } from "mongoose";

export interface IPaymentSchema extends Document {
  userId: typeof Types.ObjectId;
  clientId: string;
}

export interface IPayment {
  _id: string;
  userId: typeof Types.ObjectId;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentInput {
  clientId: string;
}

export interface ITransactionSchema extends Document {
  userId: typeof Types.ObjectId;
  staycationId: typeof Types.ObjectId;
  total: number;
  paymentType: 'full' | 'downpayment';
  history: {
    clientKey: string;
    amount: number;
    datePaid: string;
    checkoutURL: string;
  }[];
  status: 'pending' | 'paid';
  _doc: Omit<this, '_doc'>
}

export interface IPaymentMethodSchema extends Document {
  user: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  pmId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentMethod {
  user: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  pmId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}