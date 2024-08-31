import { Schema, Document, Types } from "mongoose";
import { IUserPrev } from './../user/user.interface';

export interface IStaycationSchema extends Document {
  host: typeof Types.ObjectId;
  descriptionFilter: string;
  placeType: keyof typeof EPlaceType;
  maxBooking: number;
  address: {
    country: string,
    unit: string,
    street: string,
    brgy: string,
    city: string,
    province: string,
    zip: string
  };
  landmark: string;
  location: string;
  details: any;
  amenities: string[];
  name: string;
  descriptionText: string[];
  detailedDescription: string;
  discounts: {
    discounts: string,
    value: number
  };
  security: string[];
  price: number;
  cancellationPolicy: {
    cancellationPolicy: string;
    nonRefundable: string;
  };
  houseRules: string[];
  houseRulesDetailed: string;
  bookingProcess: string;
  genImgList: string[];
  cover: string;
  bedroomList: string[];
  isListed: boolean;
  isApproved: boolean;
  _doc: Omit<this, '_doc'>
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

export interface IRecentLocationSearchSchema extends Document {
  user: typeof Types.ObjectId;
  recentSearches: string[];
}

export interface IRecentLocationSearchInput {
  user: string;
  recentSearches: string;
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
  descriptionFilter: string;
  placeType: keyof typeof EPlaceType;
  maxBooking: number;
  address: {
    country: string,
    unit: string,
    street: string,
    brgy: string,
    city: string,
    province: string,
    zip: string
  };
  landmark: string;
  location: string;
  details: any;
  amenities: string[];
  name: string;
  descriptionText: string[];
  detailedDescription: string;
  discounts: {
    discounts: string,
    value: number
  };
  security: string[];
  price: number;
  cancellationPolicy: {
    cancellationPolicy: string;
    nonRefundable: string;
  };
  houseRules: string[];
  houseRulesDetailed: string;
  bookingProcess: string;
  genImgList: string[];
  cover: string;
  bedroomList: string[];
  isListed: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IStaycationInput {
  host: string;
  descriptionFilter: string;
  placeType: keyof typeof EPlaceType;
  maxBooking: number;
  address: {
    country: string,
    unit: string,
    street: string,
    brgy: string,
    city: string,
    province: string,
    zip: string
  };
  landmark: string;
  location: string;
  details: any;
  amenities: string[];
  name: string;
  descriptionText: string[];
  detailedDescription: string;
  discounts: {
    discounts: string,
    value: number
  };
  security: string[];
  price: number;
  cancellationPolicy: {
    cancellationPolicy: string;
    nonRefundable: string;
  };
  houseRules: string[];
  houseRulesDetailed: string;
  bookingProcess: string;
  genImgList: string[];
  cover: string;
  bedroomList: string[];
  isListed: boolean;
  isApproved: boolean;
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


// export interface IStaycationSchema extends Document {
//   // name: string;
//   // host: typeof Types.ObjectId;
//   // details: typeof Schema.Types.Mixed[];
//   // currentRating: number; 
//   // desc: string;
//   // media: string[];
//   // pricing: typeof Schema.Types.Mixed[];
//   // promos: typeof Schema.Types.Mixed[];
//   // amenities: string[];
//   host: typeof Types.ObjectId;
//   name: string;
//   descriptionFilter: string[];
//   descriptionText: string[];
//   placeDescription: string;
//   // offers: string;
//   placeType: keyof typeof EPlaceType;
//   // location: {
//   //   type: string,
//   //   coordinates: any
//   // };
//   address: {
//     country: string;
//     unit?: string;
//     street: string;
//     brgy?: string;
//     city: string;
//     province: string;
//     zip: string;
//   };
//   landmark: string;
//   // bedrooms?: {
//   //   img: string;
//   //   desc: string;
//   // }[];
//   details: typeof Schema.Types.Mixed;
//   amenities: string[];
//   media: {
//     cover: string;
//     imgs: string[];
//   },
//   reservationConfirmation: keyof typeof EReservationConfirmation;
//   welcomingGuest: keyof typeof EWelcomingGuest;
//   price: {
//     common: number;
//     beforeTax: number;
//   },
//   // discounts: IStaycationDiscountSchema[];
//   discounts: string
//   security: string[];
//   isListed: boolean;
//   isApproved: boolean;
// }