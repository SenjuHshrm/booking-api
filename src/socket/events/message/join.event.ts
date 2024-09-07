import { Socket } from 'socket.io'
import MessageService from './../../../modules/message/message.service'
import { redisClient } from './../../../config'

const join = (socket: Socket) => {
  let mainJoin = async (id: string) => {
    // socket.data.userId = id
    let idKey = `${id}:msg`
    redisClient.rPush(idKey, socket.id)
    let roomIds: string[] = await MessageService.getMsgRoom(id)
    if(roomIds.length > 0) {
      socket.join(roomIds)
    }
    console.log(`User ${id} joined msg`)
  }

  socket.on('msg:join', mainJoin)
}

export default join