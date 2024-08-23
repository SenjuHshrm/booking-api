import { model, Types, Schema } from 'mongoose'
import { IMessageSchema } from '../message.interface'

let msgSchema: Schema<IMessageSchema> = new Schema<IMessageSchema>({
  roomId: { type: Types.ObjectId, ref: 'msg-room' },
  from: { type: Types.ObjectId, ref: 'user' },
  type: { type: String, enum: { values: ['text', 'media'] } },
  text: String,
  media: Schema.Types.Mixed,
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
})

const Message = model('message', msgSchema)

export default Message