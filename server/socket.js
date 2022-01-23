import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./model/user.js";

const app = express();
export const socketIOServer = createServer(app);
export const io = new Server(socketIOServer, {
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
  // when the user disconnects
  socket.on("disconnecting", async () => {
    // removing user from the rooms and upadting views
    console.log("ROOM - ", socket.rooms);
    for (const room of socket.rooms) {
      if (room != socket.id) {
        const views = (await io.in(room).fetchSockets()).length - 1;
        io.to(room).emit("updateView", { count: views });
        try {
          const user = await User.findOne({ username: room });
          if (user !== null) {
            const views = (await io.in(room).fetchSockets()).length;
            user.clients.forEach((client) => {
              io.to(client).emit("updateClientView", { count: views });
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    // removing socket ids from user
    if (socket.data.user) {
      try {
        const user = await User.findOne({ username: socket.data.user });
        if (user !== null) {
          user.clients = user.clients.filter((client) => client !== socket.id);
          await user.save((err, data) => {
            if (err) {
              throw "ERROR";
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  });

  // add the user object to socket.io object
  socket.on("add-client", async (user) => {
    socket.data.user = user;
  });

  // join a room
  socket.on("join-room", async (room) => {
    // console.log(`${socket.id} joined ${room}`);
    // socket.join(room);
    const views = (await io.in(room).fetchSockets()).length;
    io.to(room).emit("updateView", { count: views });

    // sending views to clients
    try {
      const user = await User.findOne({ username: room });
      if (user !== null) {
        user.clients.forEach((client) => {
          io.to(client).emit("updateClientView", { count: views });
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  // leave a room
  socket.on("leave-room", async (room) => {
    console.log(`${socket.id} left ${room}`);
    // socket.leave(room);
    const views = (await io.in(room).fetchSockets()).length;
    io.to(room).emit("updateView", { count: views });

    // sending views
    try {
      const user = await User.findOne({ username: room });
      if (user !== null) {
        user.clients.forEach((client) => {
          // console.log(client);
          io.to(client).emit("updateClientView", { count: views });
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  // send message to room
  socket.on("sendMessage", (message, room, user) => {
    console.log(message, room, user);
    socket.to(room).emit("recieveMessage", {
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
