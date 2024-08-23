import { Socket } from 'socket.io'
import MessageService from './../../../modules/message/message.service'

const join = (socket: Socket) => {
  let mainJoin = async (id: string) => {
    let roomIds: string[] = await MessageService.getMsgRoom(id)
    socket.data.userId = id
    if(roomIds.length > 0) {
      socket.join(roomIds)
    }
  }

  socket.on('msg:join', mainJoin)
}

export default join