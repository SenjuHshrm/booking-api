import { Document, PopulatedDoc, Types } from "mongoose";

export interface IUserSchema extends Document {
  name: IUserFullName;
  img: string;
  desc?: IUserDescription;
  address: string;
  contact: string;
  status: "active" | "suspended" | "terminated";
  identificationStat: "pending" | "approved" | "disapproved";
  suspendedUntil: string;
  approvedAsProprietorOn: string;
  paymentClientId: string;
  setImg: (img: string, email: string) => void;
}

export interface IUserDescription {
  description?: string;
  hobbies?: string[];
  work?: string;
  favFood?: string;
  favPlace?: string;
}

export interface IUserAddress {
  unit?: string;
  street: string;
  brgy: string;
  city: string;
  province: string;
  country: string;
  zip: string;
}

export interface IUserFullName {
  fName: string;
  mName?: string;
  lName: string;
  xName?: string;
}

export interface IUser {
  _id: string;
  name: IUserFullName;
  img: string;
  desc: IUserDescription;
  address?: string;
  contact: string;
  status: "active" | "suspended" | "terminated";
  identificationStat: "pending" | "approved" | "disapproved";
  suspendedUntil: string;
  approvedAsProprietorOn: string;
  paymentClientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserPrev {
  _id: string;
  name: IUserFullName;
  img: string;
}

export interface IUserInput {
  fName: string;
  lName: string;
  email: string;
  password: string;
}

export interface IProprietorApplicationSchema extends Document {
  user: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  status: 'pending' | 'approved' | 'declined';
  documents: string[];
  listings: typeof Types.ObjectId[] | PopulatedDoc<any>;
  createdAt: string;
  updatedAt: string;
}

export interface IWishlistSchema extends Document {
  user: typeof Types.ObjectId;
  staycation: (typeof Types.ObjectId)[];
}

export interface IUserVerificationSchema extends Document {
  user: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  type: string;
  idFront: string;
  idBack: string;
  status: 'pending' | 'approved' | 'declined';
  reason?: string;
}

export interface IUserVerification {
  user: IUserPrev;
  type: string;
  idFront: string;
  idBack: string;
  status:  'pending' | 'approved' | 'declined';
  reason?: string;
}

export interface IUserVerificationInput {
  user: string;
  type: string;
  idFront: string;
  idBack: string;
  status: 'pending' | 'approved' | 'declined';
}