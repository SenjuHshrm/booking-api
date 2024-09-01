import join from "./join.event";
import disconnect from "./disconnect.event";
import read from "./read.event";
import { Server, Socket } from "socket.io";
import chat from "./chat.event";

const MessageEvent = (io: Server) => {
  io.of("/message").on("connection", (socket: Socket) => {
    join(socket);
    disconnect(socket);
    read(socket);
    chat(socket);
  });
};

export default MessageEvent;
