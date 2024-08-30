import { Server, Socket } from 'socket.io'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = (id: string) => {
    socket.data.userId = id
    redisClient.rPush(id, socket.id)
    socket.join(`notif:${id}`)
    socket.join('notif:general')
    console.log(`User ${id} joined notif`)
  }

  socket.on('notif:join', mainJoin)
}

export default join