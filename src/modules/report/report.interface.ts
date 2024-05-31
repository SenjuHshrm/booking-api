import { Document, Types } from 'mongoose'
import { IUserFullName } from '../user/user.interface';

export interface IReportSchema extends Document {
  reporter: typeof Types.ObjectId;
  reported: typeof Types.ObjectId;
  msg: string;
  resolved: boolean;
}

export interface IReport {
  reporter: IUserFullName;
  reported: IUserFullName;
  msg: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReportInput {
  reporter: string;
  reported: string;
  msg: string;
}