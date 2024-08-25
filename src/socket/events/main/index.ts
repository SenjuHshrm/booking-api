import join from './join.event'
import disconnect from './disconnect.event'
import { Server, Socket } from 'socket.io'

const MainEvent = (io: Server) => {

  io.of('/').on('connection', (socket: Socket) => {
    join(socket)
    disconnect(socket)
  })
}

export default MainEvent