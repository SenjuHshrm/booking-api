import { Socket } from 'socket.io'
import { redisClient } from './../../../config'

const disconnect = (socket: Socket) =>{
  let userDisconnected = async (reason: string) => {
    if(socket.data.userId) {
      await redisClient.lRem(socket.data.userId, 0, socket.id)
    }
    console.log(`User ${socket.id} disconnected (${reason})`)
  }
  socket.on('disconnect', userDisconnected)
}

export default disconnect