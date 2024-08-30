import Message from './../../../modules/message/schema/Message.schema'
import { Socket } from 'socket.io'

const read = (socket: Socket) => {
  let receiveChat = async (msgId: string, roomId: string) => {
    await Message.findByIdAndUpdate(msgId, { $set: { isRead: true } }).exec()
    socket.to(roomId).emit('msg:chat:msg-read', { roomId, msgId })
  }


  socket.on('msg:chat:read', receiveChat)
}

export default read