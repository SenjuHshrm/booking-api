import { Document, Types } from 'mongoose'

export interface IImageCarouselFrontSchema extends Document {
  img: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IImageCarouselLocSchema extends Document {
  img: string;
  desc: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IImageCarouselFront {
  _id: string;
  img: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IImageCarouselLoc {
  _id: string;
  img: string;
  desc: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IImageCarouselFrontInput {
  img: string;
  isActive: boolean;
}

export interface IImageCarouselLocInput {
  img: string;
  desc: string;
  isActive: boolean;
}

