import { Server, Socket } from 'socket.io'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = (id: string) => {
    // redisClient.rPush(id, socket.id)
  }

  socket.on('msg:join', mainJoin)
}

export default join