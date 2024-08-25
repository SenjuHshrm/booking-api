import { Server, Socket } from 'socket.io'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = (id: string) => {
    socket.data.userId = id
    redisClient.rPush(id, socket.id)
    socket.join(`notif:${id}`)
    socket.join('notif:general')
  }

  socket.on('notif:join', mainJoin)
}

export default join