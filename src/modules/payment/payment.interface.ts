import { Document } from "mongoose";

export interface IPaymentSchema extends Document {
  paymentType: keyof typeof EPaymentType;
  name: string;
  bankName: string;
  acctNum?: string;
  cardNum?: string;
  cvv?: string;
}

export enum EPaymentType {
  'ewallet', 'debit', 'credit'
}

export interface IPayment {
  _id: string;
  paymentType: keyof typeof EPaymentType;
  name: string;
  acctNum?: string;
  cardNum?: string;
  cvv?: string;
  createdAt: string;
  updatedAt: string;
}