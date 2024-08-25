import join from './join.event'
import disconnect from './disconnect.event'
import { Server, Socket } from 'socket.io'

// const NotificationEvent = { join, disconnect }

const NotificationEvent = (io: Server) => {

  io.of('/notification').on('connection', (socket: Socket) => {
    join(socket)
    disconnect(socket)
  })
}


export default NotificationEvent