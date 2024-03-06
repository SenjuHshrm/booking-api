import { Document, Types } from "mongoose";

export interface IAuthSchema extends Document {
  userId: typeof Types.ObjectId;
  email: string;
  password: string;
  google?: any;
}

export interface IAuth {
  _id: string;
  userId: string;
  email: string;
  password: string;
  google?: any;
  createdAt: string;
  updatedAt: string;
}