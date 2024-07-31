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