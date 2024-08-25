import { IUserVerificationSchema } from "../user.interface";
import { Types, model, Schema } from 'mongoose';

let userVerification: Schema<IUserVerificationSchema> =  new Schema<IUserVerificationSchema>({
  user: { type: Types.ObjectId, ref: 'user' },
  type: { type: String, required: true },
  idFront: { type: String, required: true },
  idBack: { type: String, required: true },
  status: { type: String, enum: { values: ['pending', 'approved', 'declined'] } },
  reason: String
})

const UserVerification = model('user-verification', userVerification)

export default UserVerification