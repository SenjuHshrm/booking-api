import { IUserPrev } from './../user/user.interface';
import { Types, Document, Mixed, PopulatedDoc } from 'mongoose';

export interface IMessageSchema extends Document {
  roomId: typeof Types.ObjectId;
  from: typeof Types.ObjectId | PopulatedDoc<IUserPrev>;
  type: 'text' | 'media';
  text: string;
  media: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  _doc: Omit<this, '_doc'>;
}

export interface IMessageRoomSchema extends Document {
  members: typeof Types.ObjectId[] | PopulatedDoc<IUserPrev[]>;
  img?: string;
  createdAt: string;
  updatedAt: string;
  _doc: Omit<this, '_doc'>;
}

export interface IMessage {
  _id: string;
  roomId: string;
  from: PopulatedDoc<IUserPrev>;
  type: 'text' | 'media';
  text: string;
  media: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMessageInput {
  roomId: string;
  from: string;
  type: 'text' | 'media';
  text: string;
  media: any;
}

export interface IMessageRoom {
  _id: string;
  members: PopulatedDoc<IUserPrev[]>;
  img?: string;
  msgPrev: string;
  lastMsg: string;
  createdAt: string;
  updatedAt: string;
}