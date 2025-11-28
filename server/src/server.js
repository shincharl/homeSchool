import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

// http 서버 설정
const httpServer = http.createServer(app);

// http 서버 위에 웹 소켓 서버 설정 (client: 5173, server: 3000 port)
const wsServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";

  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    done();
    socket.join(roomName);
    socket.to(roomName).emit("welcome", socket.nickname);
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
    });
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

const handleListen = () => console.log("Listening on http://localhost:3000");

httpServer.listen(3000, handleListen);
