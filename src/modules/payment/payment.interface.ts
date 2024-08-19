import { Document, Types } from "mongoose";

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
  piId: string;
  amount: number;
  paymentType: 'full' | 'downpayment';
  remainingBal: number;
  remainingBalDue: string;
  clientKey: string;
  status: string;
  checkoutURL: string;
}