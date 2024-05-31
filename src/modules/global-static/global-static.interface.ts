import { Document, Schema } from "mongoose";

export interface IGlobalStaticSchema extends Document {
  type: keyof typeof EStaticType;
  values: typeof Schema.Types.Mixed;
}

export enum EStaticType {
  "amenity", "bank", "service_fee"
}