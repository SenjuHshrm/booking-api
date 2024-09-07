import { Server, Socket } from 'socket.io'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = (id: string) => {
    // socket.data.userId = id
    let idKey = `${id}:notif`
    redisClient.rPush(idKey, socket.id)
    socket.join(`notif:${id}`)
    socket.join('notif:general')
    console.log(`User ${id} joined notif`)
  }

  socket.on('notif:join', mainJoin)
}

export default join