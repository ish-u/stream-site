import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const socketIOServer = createServer(app);
const io = new Server(socketIOServer, {
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"],
    credentials: false,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // join a room
  socket.on("join-room", (room) => {
    console.log(`${socket.id} joined ${room}`);
    socket.join(room);
  });

  // join a room
  socket.on("leave-room", (room) => {
    console.log(`${socket.id} left ${room}`);
    socket.leave(room);
  });

  // send message to room
  socket.on("sendMessage", (message, room, user) => {
    console.log(message, room, user);
    socket
      .to(room)
      .emit("recieveMessage", {
        id: Math.random() * Math.random(),
        user: user,
        message: message,
      });
  });

  // ping server
  socket.on("pingServer", (msg) => {
    console.log(msg);
    socket.emit("pongServer", "PONG");
  });
});

export default socketIOServer;
