import { Schema, Document, Types } from "mongoose";
import { IUserPrev } from './../user/user.interface';
export interface IStaycationSchema extends Document {
  // name: string;
  // host: typeof Types.ObjectId;
  // details: typeof Schema.Types.Mixed[];
  // currentRating: number; 
  // desc: string;
  // media: string[];
  // pricing: typeof Schema.Types.Mixed[];
  // promos: typeof Schema.Types.Mixed[];
  // amenities: string[];
  host: typeof Types.ObjectId;
  name: string;
  descriptionFilter: string[];
  descriptionText: string[];
  placeType: keyof typeof EPlaceType;
  // location: {
  //   type: string,
  //   coordinates: any
  // };
  address: {
    country: string;
    unit?: string;
    street: string;
    brgy?: string;
    city: string;
    province: string;
    zip: string;
  };
  details: typeof Schema.Types.Mixed;
  amenities: string[];
  media: {
    cover: string;
    imgs: string[];
  },
  reservationConfirmation: keyof typeof EReservationConfirmation;
  welcomingGuest: keyof typeof EWelcomingGuest;
  price: {
    common: number;
    beforeTax: number;
  },
  // discounts: IStaycationDiscountSchema[];
  discounts: string
  security: string[];
  isListed: boolean;
  isApproved: boolean;
}

export interface IStaycationDiscountSchema extends Document {
  percentage: number;
  name: string;
  description: string;
}

export interface IReviewSchema extends Document {
  staycation: typeof Types.ObjectId;
  user: typeof Types.ObjectId;
  rating: number;
  comment: string;
  media: string[];
}

export interface IStaycationDiscount {
  percentage: number;
  name: string;
  description: string;
}

export interface IReview {
  staycation: IStaycation;
  user: IUserPrev;
  rating: string;
  comment: string;
  media: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IStaycation {
  _id: string;
  host: IUserPrev;
  name: string;
  descriptionFilter: string[];
  descriptionText: string[];
  placeType: keyof typeof EPlaceType;
  location: {
    type: string,
    coordinates: any
  };
  address: {
    country: string;
    unit?: string;
    street: string;
    brgy?: string;
    city: string;
    province: string;
    zip: string;
  };
  details: any;
  amenities: string[];
  media: {
    cover: string;
    imgs: string[];
  },
  reservationConfirmation: keyof typeof EReservationConfirmation;
  welcomingGuest: keyof typeof EWelcomingGuest;
  price: {
    common: number;
    beforeTax: number;
  },
  // discounts: IStaycationDiscount[];
  discounts: string;
  security: string[];
  isApproved: boolean;
}

export interface IStaycationInput {
  host: string;
  name: string;
  serverDirName: string;
  descriptionFilter: string[];
  descriptionText: string[];
  placeType: keyof typeof EPlaceType;
  // location: {
  //   type: string,
  //   coordinates: any
  // };
  address: {
    country: string;
    unit?: string;
    street: string;
    brgy?: string;
    city: string;
    province: string;
    zip: string;
  };
  details: any;
  amenities: string[];
  media: {
    cover: string;
    imgs: string[];
  },
  reservationConfirmation: keyof typeof EReservationConfirmation;
  welcomingGuest: keyof typeof EWelcomingGuest;
  price: {
    common: number;
    beforeTax: number;
  },
  // discounts: IStaycationDiscount[];
  discounts: string;
  security: string[];
}

export enum EPlaceType {
  "event_place", "room", "room_shared"
}

export enum EReservationConfirmation {
  "instant_book", "direct_msg"
}

export enum EWelcomingGuest {
  "tarago", "exp_guest"
}