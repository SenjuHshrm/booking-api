import { Document, Types } from "mongoose";

export interface IAuthSchema extends Document {
  userId: typeof Types.ObjectId;
  email: string;
  password: string;
  google?: any;
  access: keyof typeof EUserType[];
  generateHash: (password: string) => void;
  compareHash: (password: string) => boolean;
  generateToken: (img: string) => { access: string, refresh: string }
}

export interface IPersonalAccessTokenSchema extends Document {
  userId: typeof Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  device?: string;
}

export interface IAuth {
  _id: string;
  userId: string;
  email: string;
  password: string;
  google?: any;
}

export interface IPersonalAccessToken {
  _id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  device?: string;
}

export enum EUserType {
  'admin', 'host', 'customer'
}