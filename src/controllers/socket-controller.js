const Socket = require("socket.io").Socket;

/**
 * @param {Socket} socket
 */
const onSocketConnection = (socket) => {
  socket.on("joinRoom", onPlayerJoin(socket));
  socket.on("leaveRoom", onPlayerLeave(socket));
  socket.on("message", ({ room, message }) => {
    io.to(room).emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
};

/**
 *
 * @param {Socket} socket
 * @returns {(payload: Object) => void}
 */
const onPlayerJoin = (socket) => (payload) => {
  socket.join(room);
  console.log(`${socket.id} joined room ${room}`);
  console.log(socket.rooms);
  io.to(room).emit("message", `User ${socket.id} has joined the room ${room}`);
};

/**
 *
 * @param {Socket} socket
 * @returns {(payload: Object) => void}
 */
const onPlayerLeave = (socket) => (payload) => {
  socket.leave(room);
  socket.broadcast();
  console.log(`${socket.id} left room ${room}`);
  io.to(room).emit("message", `User ${socket.id} has left the room ${room}`);
};

const onPlayerAction = (payload) => {};

module.exports = {
  onSocketConnection,
};
