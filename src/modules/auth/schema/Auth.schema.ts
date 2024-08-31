import { Schema, model, Types } from 'mongoose';
import bcryptjs from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { IAuthSchema, EUserType } from './../auth.interface';
import { env } from './../../../config'

let AuthSchema: Schema<IAuthSchema> = new Schema<IAuthSchema>({
  userId: { type: Types.ObjectId, ref: 'user' },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  google: Schema.Types.Mixed,
  access: { type: [String], required: true }
}, {
  timestamps: true
})

AuthSchema.methods.generateHash = function (password: string) {
  this.password = bcryptjs.hashSync(password, 12)
}

AuthSchema.methods.compareHash = function (password: string) {
  return bcryptjs.compareSync(password, this.password)
}

AuthSchema.methods.generateToken = function (img: string) {
  return {
    access: jwt.sign({ sub: this.userId, access: this.access, img }, env.JWT_SECRET, { expiresIn: '5m' }),
    refresh: jwt.sign({ sub: this.userId, email: this.email }, env.JWT_SECRET, { expiresIn: '1w' })
  }
}

const Auth = model('auth', AuthSchema)

export default Auth