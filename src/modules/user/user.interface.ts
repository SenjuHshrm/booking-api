import { Document, Types } from "mongoose";
import { IPayment } from "../payment/payment.interface";

export interface IUserSchema extends Document {
  name: IUserFullName;
  img: string;
  type: keyof typeof EUserType;
  desc: IUserDescription;
  address: string;
  payment?: typeof Types.ObjectId[];
}

export interface IUserDescription {
  description: string;
  hobbies: string[];
  work: string;
  favFood: string;
  favPlace: string;
}

export interface IUserFullName {
  fName: string;
  mName?: string;
  lName: string;
  xName?: string
}

export interface IUser {
  _id: string;
  name: IUserFullName;
  img: string;
  type: keyof typeof EUserType;
  desc: IUserDescription;
  address: string;
  payment?: IPayment[];
  createdAt: string;
  updatedAt: string;
}

export enum EUserType {
  'admin', 'host', 'customer'
}

export interface IUserPrev {
  _id: string;
  name: string;
  img: string;
}