import {
  IMessageInput,
  IMessageSchema,
} from "./../../../modules/message/message.interface";
import Message from "./../../../modules/message/schema/Message.schema";
import { Socket } from "socket.io";

const chat = (socket: Socket) => {
  let receiveChat = async (data: IMessageInput) => {
    // let newMsg = new Message({ ...data });
    // let msg = newMsg
    //   .save()
    //   .then((m: IMessageSchema) => m.populate("from"))
    //   .then(m => m);

    // socket.to(data.roomId).emit("msg:chat:send", msg);
    new Message({ ...data })
      .save()
      .then((m: IMessageSchema) => m.populate("from"))
      .then(m => {
        socket.to(data.roomId).emit("msg:chat:send", m);
      });
  };

  socket.on("msg:chat:receive", receiveChat);
};

export default chat;
