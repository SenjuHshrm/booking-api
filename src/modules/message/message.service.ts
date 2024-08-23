import { IMessage, IMessageSchema, IMessageRoom, IMessageRoomSchema, IMessageInput } from "./message.interface";
import { logger } from './../../utils'
import Message from "./schema/Message.schema";
import MessageRoom from "./schema/MessageRoom.schema";
import { Response } from 'express'
import { IUserPrev } from "modules/user/user.interface";

let saveMsg = async (data: IMessage): Promise<void> => {
  try {
    new Message({ ...data }).save()
  } catch(e: any) {
    logger('message.socket', 'saveMsg', e.message, 'MSG-0001')
  }
}

let getMsgRoom = async (id: string): Promise<string[]> => {
  try {
    let rooms: IMessageRoomSchema[] = <IMessageRoomSchema[]>(await MessageRoom.find({ members: id }).exec())
    let resp: string[] = rooms.map((room: IMessageRoomSchema) => room.id)
    return resp
  } catch(e: any) {
    logger('message.socket', 'getMsgRoom', e.message, 'MSG-0002')
    throw(e.message)
  }
}

let saveMsgAndCreateRoom = async (res: Response, receiverId: string, data: IMessageInput): Promise<Response> => {
  try {
    let newRoom = await new MessageRoom({ members: [receiverId, data.from] }).save()
    data.roomId = newRoom.id
    new Message({ ...data }).save()
    return res.status(201).json({ room: newRoom.id })
  } catch(e: any) {
    logger('message.controller', 'saveMsgAndCreateRoom', e.message, 'MSG-0003')
    return res.status(500).json({ code: 'MSG-0003' })
  }
}

let getMessageRooms = async (res: Response, id: string): Promise<Response> => {
  try {
    let rooms: IMessageRoomSchema[] = <IMessageRoomSchema[]>(await MessageRoom.find({ members: id }).populate({ path: 'members', select: '_id name img' }).exec())
    let resp: Promise<IMessageRoom[]> = Promise.all(rooms.map(async (room: IMessageRoomSchema) => {
      let m: IMessageSchema = <IMessageSchema>(await Message.findOne({ roomId: room.id }).sort({ createdAt: -1 }).exec())
      return {
        _id: room.id,
        img: room.img,
        members: <IUserPrev[]>room.members,
        msgPrev: m.text || '',
        lastMsg: m ? m.createdAt : room.createdAt,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      }
    }))
    return res.status(200).json(await resp)
  } catch(e: any) {
    logger('message.controller', 'getMessageRooms', e.message, 'MSG-0004')
    return res.status(500).json({ code: 'MSG-0004' })
  }
}

let getMessageThread = async (res: Response, roomId: string, page: number, limit: number): Promise<Response> => {
  try {
    let msgs: IMessageSchema[] = <IMessageSchema[]>(await Message.find({ roomId }).populate({ path: 'from', select: '_id name img' }).skip(page).limit(limit).sort({ createdAt: 1 }).exec())
    return res.status(200).json(msgs)
  } catch(e: any) {
    logger('message.controller', 'getMessageThread', e.message, 'MSG-0005')
    return res.status(500).json({ code: 'MSG-0005' })
  }
}

const MessageService = {
  saveMsg,
  getMsgRoom,
  saveMsgAndCreateRoom,
  getMessageRooms,
  getMessageThread
}

export default MessageService