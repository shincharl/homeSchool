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

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    done();
    console.log(roomName);
    console.log(socket.id);
    console.log(socket.rooms);
    socket.join(roomName);
    console.log(socket.rooms);
  });
});

const handleListen = () => console.log("Listening on http://localhost:3000");

httpServer.listen(3000, handleListen);
