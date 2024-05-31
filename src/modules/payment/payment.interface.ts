import { Document, Types } from "mongoose";

export interface IPaymentSchema extends Document {
  paymentType: keyof typeof EPaymentType;
  userId: typeof Types.ObjectId;
  name: string;
  bankName: string;
  acctNum?: string;
  cardNum?: string;
  cvv?: string;
}

export enum EPaymentType {
  'ewallet', 'debit', 'credit', 'bank'
}

export interface IPayment {
  _id: string;
  paymentType: keyof typeof EPaymentType;
  userId: string;
  name: string;
  bankName: string;
  acctNum?: string;
  cardNum?: string;
  cvv?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentInput {
  paymentType: keyof typeof EPaymentType,
  userId: string;
  name: string;
  bankName: string;
  acctNum?: string;
  cardNum?: string;
  cvv?: string;
}