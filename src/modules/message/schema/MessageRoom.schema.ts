import { model, Types, Schema } from 'mongoose';
import { IMessageRoomSchema } from './../message.interface'

let msgRoomSchema: Schema<IMessageRoomSchema> = new Schema<IMessageRoomSchema>({
  members: { type: [Types.ObjectId], ref: 'user' },
  img: String
}, {
  timestamps: true
})

const MessageRoom = model('msg-room', msgRoomSchema)

export default MessageRoom