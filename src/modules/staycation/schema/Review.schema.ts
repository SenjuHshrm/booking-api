import { Schema, model, Types } from "mongoose";
import { IReviewSchema } from "../staycation.interface";

let ReviewSchema: Schema<IReviewSchema> = new Schema<IReviewSchema>(
  {
    staycation: { type: Types.ObjectId, ref: "staycation" },
    user: { type: Types.ObjectId, ref: "user" },
    rating: { type: Number, required: true },
    comment: String,
    media: [String],
  },
  {
    timestamps: true,
  }
);

const Review = model("review", ReviewSchema);

export default Review;
