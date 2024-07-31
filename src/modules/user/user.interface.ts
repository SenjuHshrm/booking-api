import { Document, Types } from "mongoose";

export interface IUserSchema extends Document {
  name: IUserFullName;
  img: string;
  desc?: IUserDescription;
  address: string;
  contact: string;
  status: 'active' | 'suspended' | 'terminated';
  identificationStat: 'pending' | 'approved' | 'disapproved';
  suspendedUntil: string;
  approvedAsProprietorOn: string;
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
  status: 'active' | 'suspended' | 'terminated';
  identificationStat: 'pending' | 'approved' | 'disapproved';
  suspendedUntil: string;
  approvedAsProprietorOn: string;
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