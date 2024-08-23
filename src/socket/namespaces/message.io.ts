import { Server, Socket, Event } from 'socket.io'
import MessageEvent from './../events/message'

const Message = (io: Server) => {
  let useMiddleware = (event: Event, next: (err?: Error | undefined) => void): void => {
    console.log(event)
    next()
  }

  let onConnection = (socket: Socket) => {
    socket.use(useMiddleware)
    MessageEvent.join(socket)
    MessageEvent.disconnect(socket)
  }
  io.of('/message').adapter.on('connection', onConnection)
}

export default Message