import { Server, Socket } from 'socket.io'
import MainEvent from './../events/main'

const Main = (io: Server) => {
  let onConnection = (socket: Socket) => {
    MainEvent.join(socket)
    MainEvent.disconnect(socket)
  }

  io.of('/').adapter.on('connection', onConnection)
}

export default Main