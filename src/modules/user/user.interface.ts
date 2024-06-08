import { Document, Types } from "mongoose";
import { IPayment } from "../payment/payment.interface";

export interface IUserSchema extends Document {
  name: IUserFullName;
  img: string;
  desc?: IUserDescription;
  address: string;
  contact: string;
  payment?: typeof Types.ObjectId[];
  status: 'active' | 'suspended' | 'terminated';
  identificationStat: 'pending' | 'approved' | 'disapproved';
  suspendedUntil: string;
  setImg: (img: string, email: string) => void;
}

export interface IUserDescription {
  description?: string;
  hobbies?: string[];
  work?: string;
  favFood?: string;
  favPlace?: string;
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
  desc: IUserDescription;
  address?: string;
  contact: string;
  payment?: IPayment[];
  status: 'active' | 'suspended' | 'terminated';
  identificationStat: 'pending' | 'approved' | 'disapproved';
  suspendedUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserPrev {
  _id: string;
  name: string;
  img: string;
}

export interface IUserInput {
  fName: string;
  lName: string;
  email: string;
}

export interface IProprietorApplicationSchema extends Document{
  userId: typeof Types.ObjectId;
  staycationId: typeof Types.ObjectId;
}

export interface IWishlistSchema extends Document {
  user: typeof Types.ObjectId;
  staycation: typeof Types.ObjectId[]
}