require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");
// Socket.io has got routing capabilities, ws would have been annoying to use routing

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Handle socket connections
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  // Handle joining a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
    io.to(room).emit(
      "message",
      `User ${socket.id} has joined the room ${room}`
    );
  });

  // Handle leaving a room
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`${socket.id} left room ${room}`);
    io.to(room).emit("message", `User ${socket.id} has left the room ${room}`);
  });

  // Handle sending a message to a room
  socket.on("message", ({ room, message }) => {
    io.to(room).emit("message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}.`);
});
