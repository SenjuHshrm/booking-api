import { Server, Socket } from 'socket.io'
import NotificationEvent from './../events/notification'

let Notification = (io: Server) => {
  let onConnection = (socket: Socket) => {
    NotificationEvent.join(socket)
    NotificationEvent.disconnect(socket)
  }

  io.of('/notification').adapter.on('connection', onConnection)
}

export default Notification