import { Schema, Types, model } from 'mongoose';
import { IProprietorApplicationSchema } from '../user.interface';

let propAppSchema: Schema<IProprietorApplicationSchema> = new Schema<IProprietorApplicationSchema>({
  user: { type: Types.ObjectId, ref: 'user' },
  status: { type: String, enum: { values: ['pending', 'approved', 'declined'] } },
  documents: { type: [String] },
  listings: { type: [Types.ObjectId], ref: 'staycation' }
}, {
  timestamps: true
})

const ProprietorApplication = model('proprietor-application', propAppSchema)

export default ProprietorApplication