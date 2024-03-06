import { IUserPrev } from './../user/user.interface';
import { Document, Types } from "mongoose";

export interface IStaycationSchema extends Document {
  name: string;
  host: typeof Types.ObjectId;
  desc: string;
  media: string[];
  pricing: string;
  reviews: typeof Types.ObjectId[];
}

export interface IReviewSchema extends Document {
  user: typeof Types.ObjectId;
  rating: string;
  comment: string;
}

export interface IReview {
  user: IUserPrev;
  rating: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStaycation {
  _id: string;
  name: string;
  host: IUserPrev;
  desc: string;
  media: string[];
  pricing: string;
  reviews: IReview[];
  createdAt: string;
  updatedAt: string;
}