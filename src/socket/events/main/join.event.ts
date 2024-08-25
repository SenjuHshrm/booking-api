import { Server, Socket } from 'socket.io'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = (id: string) => {
    socket.data.userId = id
    redisClient.rPush(id, socket.id)
  }

  socket.on('main:join', mainJoin)
}

export default join