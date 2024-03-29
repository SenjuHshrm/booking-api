import { Server, Socket } from 'socket.io'

export const IO = (io: Server) => {
  const onConnection = (socket: Socket) => {

  }

  io.on('connection', onConnection)
}