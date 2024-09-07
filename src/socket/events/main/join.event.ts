import { Server, Socket } from 'socket.io'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = (id: string) => {
    // socket.data.userId = id
    let idKey = `${id}:main`
    redisClient.rPush(idKey, socket.id)
    console.log(`User ${idKey} joined main`)
  }

  socket.on('main:join', mainJoin)
}

export default join