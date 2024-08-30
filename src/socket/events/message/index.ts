import join from './join.event'
import disconnect from './disconnect.event'
import read from './read.event'
import { Server, Socket } from 'socket.io'

const MessageEvent = (io: Server) => {

  io.of('/message').on('connection', (socket: Socket) => {
    join(socket)
    disconnect(socket)
    read(socket)
  })
}

export default MessageEvent