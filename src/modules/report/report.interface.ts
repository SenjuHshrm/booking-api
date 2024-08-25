import { IUserPrev } from './../user/user.interface';
import { Document, Types, PopulatedDoc } from 'mongoose'

export interface IReportSchema extends Document {
  reporter: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  reported: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  msg: string;
  action: 'no-action' | 'warning' | 'suspend' | 'terminate';
  createdAt: string;
  updatedAt: string;
}

export interface IReport {
  reporter: IUserPrev;
  reported: IUserPrev;
  msg: string;
  action: 'no-action' | 'warning' | 'suspend' | 'terminate';
  createdAt: string;
  updatedAt: string;
}

export interface IReportInput {
  reporter: string;
  reported: string;
  msg: string;
}