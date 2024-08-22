import { Server, Socket } from 'socket.io'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = (id: string) => {
    console.log(socket.client)
  }

  socket.on('notif:join', mainJoin)
}

export default join