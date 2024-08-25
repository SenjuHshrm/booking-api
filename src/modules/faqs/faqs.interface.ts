import { IUserPrev } from './../user/user.interface'
import { Document, PopulatedDoc, Types } from 'mongoose'

export interface IFAQsSchema extends Document {
  addedBy: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  question: string;
  answer: string;
  isActive: boolean;
  _doc: Omit<this, '_doc'>
}

export interface IFAQsInput {
  addedBy: string;
  question: string;
  answer: string;
}

export interface IFAQs {
  addedBy: IUserPrev;
  question: string;
  answer: string;
  isActive: boolean;
}