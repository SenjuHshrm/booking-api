import { IUserPrev } from 'modules/user/user.interface'
import { Document, PopulatedDoc, Types } from 'mongoose'

export interface INotificationSchema extends Document {
  from: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  to: typeof Types.ObjectId[] | PopulatedDoc<IUserPrev[]>;
  type: string;
  link?: string;
  msg: string;
  _doc: Omit<this, '_doc'>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationInput {
  from: string;
  to: string[];
  type: string;
  link?: string;
  msg: string;
  isRead: boolean;
}

export interface INotificationCountSchema extends Document {
  user: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  notif: number;
  msg: number;
}