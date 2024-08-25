import { Server, Socket } from 'socket.io'
import MainEvent from './events/main'
import MessageEvent from './events/message'
import NotificationEvent from './events/notification'

const IO = (io: Server) => {

  MainEvent(io)
  MessageEvent(io)
  NotificationEvent(io)
  
}

export default IO