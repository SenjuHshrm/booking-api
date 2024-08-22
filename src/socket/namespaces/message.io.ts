import { Server, Socket } from 'socket.io'
import MessageEvent from './../events/message'

const Message = (io: Server) => {
  let onConnection = (socket: Socket) => {
    MessageEvent.join(socket)
    MessageEvent.disconnect(socket)
  }
  io.of('/message').adapter.on('connection', onConnection)
}

export default Message