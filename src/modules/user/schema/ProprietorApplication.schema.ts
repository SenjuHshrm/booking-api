import { Schema, Types, model } from 'mongoose';
import { IProprietorApplicationSchema } from '../user.interface';

let propAppSchema: Schema<IProprietorApplicationSchema> = new Schema<IProprietorApplicationSchema>({
  userId: { type: Types.ObjectId, ref: 'user' },
  staycationId: { type: Types.ObjectId, ref: 'staycation' }
})

const ProprietorApplication = model('proprietor-application', propAppSchema)

export default ProprietorApplication