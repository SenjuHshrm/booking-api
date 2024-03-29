import { Schema, model, Types } from 'mongoose';
import { IPersonalAccessTokenSchema } from '../auth.interface';

let PersonalAccessTokenSchema: Schema<IPersonalAccessTokenSchema> = new Schema<IPersonalAccessTokenSchema>({
  userId: { type: Types.ObjectId, ref: 'user' },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  device: String
}, {
  timestamps: true
})

export const PersonalAccessToken = model('access-token', PersonalAccessTokenSchema)