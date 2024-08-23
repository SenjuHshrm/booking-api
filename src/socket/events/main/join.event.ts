import { Server, Socket } from 'socket.io'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = (id: string) => {
    socket.data.userId = id
    // socket.emit('main:sample-emit', socket.client)
    console.log(socket.data.userId)
  }

  socket.on('main:join', mainJoin)
}

export default join