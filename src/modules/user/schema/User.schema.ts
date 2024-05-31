import { Schema, model, Types } from 'mongoose';
import { createHash } from 'crypto';
import { IUserSchema, IUserFullName, IUserDescription } from './../user.interface';

let FullName: Schema<IUserFullName> = new Schema<IUserFullName>({
  fName: { type: String, required: true },
  mName: String,
  lName: { type: String, required: true },
  xName: String
})

let UserDescription: Schema<IUserDescription> = new Schema<IUserDescription>({
  description: String,
  hobbies: [String],
  work: String,
  favFood: String,
  favPlace: String
})

let UserSchema: Schema<IUserSchema> = new Schema<IUserSchema>({
  name: FullName,
  img: String,
  desc: UserDescription,
  address: String,
  payment: { type: [Types.ObjectId], ref: 'payment' },
  status: { type: String, required: true, enum: { values: ['active', 'suspended', 'terminated'] } },
  identificationStat: { type: String, required: true, enum: { values: ['pending', 'approved', 'disapproved'] } },
  suspendedUntil: String
}, {
  timestamps: true
})

UserSchema.methods.setImg = function(img: string, email: string) {
  let md5 = createHash('md5').update(email).digest('hex');
  this.img = (img !== '') ? img : `https://gravatar.com/avatar/${md5}?d=retro`
}

const User = model('user', UserSchema)

export default User