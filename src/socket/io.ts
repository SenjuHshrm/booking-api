import { Server, Socket } from 'socket.io'
import Main from './namespaces/main.io'
import Notification from './namespaces/notification.io'
import Message from './namespaces/message.io'

const IO = (io: Server) => {
  Main(io)
  Notification(io)
  Message(io)
}

export default IO