// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// 현재 존재하는 실제 방 목록 가져오기
const getRooms = () => {
  const rooms = [];
  const sids = io.sockets.adapter.sids; // 각 소켓이 가진 개인 룸
  const allRooms = io.sockets.adapter.rooms; // 전체 룸 목록

  for (const [roomId, room] of allRooms) {
    if (!sids.has(roomId) && room.size > 0) {
      rooms.push(roomId); // socket.id가 아닌 방만 추가
    }
  }
  return rooms;
};

// 모든 클라이언트에게 방 목록 브로드캐스트
const broadcastRooms = () => {
  io.emit("roomList", getRooms());
};

const hosts = {}; // 서버 전체 공용

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 클라이언트가 방 목록 요청 전달
  socket.on("getRooms", () => {
    socket.emit("roomList", getRooms());
  });

  // 방 참여
  socket.on("join", (room) => {
    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);
    socket.room = room;

    // 방에 Host 등록
    if (!hosts[room]) {
      hosts[room] = socket.id; // 첫 입장자가 Host
      console.log(`Host set for room ${room}: ${socket.id}`);
      socket.emit("hostWaiting");
    } else {
      const hostId = hosts[room];
      io.to(hostId).emit("readyForOffer");
    }

    // join 완료 이벤트
    socket.emit("joined", room);

    // 방에 이미 있는 다른 소켓에게 Host가 offer를 보내도 되는 신호
    const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
    if (clients.length > 1) {
      // 방에 다른 소켓이 있으면 ready 신호
      socket.to(room).emit("readyForOffer");
    }

    // 방 목록 갱싱
    io.emit("roomList", getRooms());
  });

  // Offer, Answer, ICE Candidate 전달
  const relayEvent = (eventName) => (payload) => {
    // 방 목록 중 첫 번째 방으로만 전달
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    rooms.forEach((room) => {
      socket.to(room).emit(eventName, payload);
    });
  };

  socket.on("offer", relayEvent("offer"));
  socket.on("answer", relayEvent("answer"));
  socket.on("ice", relayEvent("ice"));

  // 연결 끊김
  socket.on("disconnecting", () => {
    console.log("User disconnecting:", socket.id);

    if (socket.room && hosts[socket.room] === socket.id) {
      // Host가 나가면 방에서 Host 제거
      delete hosts[socket.room];
      console.log(`Host left, room ${socket.room} now has no host`);
    }

    setTimeout(broadcastRooms, 0);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // 연결되자마자 방 목록 브로드캐스트
  broadcastRooms();
});

server.listen(3000, () => console.log("Socket.IO server running on port 3000"));
