const { Socket, Server: SocketServer } = require("socket.io");

/**
 * @param {SocketServer} io
 * @returns {(socket: Socket) => void}
 */
const onSocketConnection = (io) => (socket) => {
  socket.on("joinRoom", onPlayerJoin(io, socket));
  socket.on("leaveRoom", onPlayerLeave(io, socket));

  socket.on("requestSessionJoin", onRequestSessionJoin(io, socket));
  socket.on("leaveSession", onSessionLeave(io, socket));

  socket.on("addSessionPlayer", onAddSessionPlayer(io, socket));
  socket.on("removeSessionPlayer", onRemoveSessionPlayer(io, socket));

  socket.on("message", ({ room, message }) => {
    io.to(room).emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
};

/**
 * @param {SocketServer} io
 * @param {Socket} socket
 * @returns {(payload: Object) => void}
 */
const onRequestSessionJoin = (io, socket) => (payload) => {
  io.to(payload.code).emit("requestSessionJoin", {
    ...payload,
    socketId: socket.id,
  });
};

/**
 * @param {SocketServer} io
 * @param {Socket} socket
 * @returns {(payload: Object) => void}
 */
const onSessionLeave = (io, socket) => (payload) => {
  io.to(payload.code).emit("playerLeave", {
    socketId: socket.id,
  });
  socket.disconnect();
};

/**
 * @param {SocketServer} io
 * @param {Socket} socket
 * @returns {(payload: Object) => void}
 */
const onAddSessionPlayer = (io, socket) => (payload) => {
  io.sockets.sockets.get(payload.socketId).join(payload.code);
};

/**
 * @param {SocketServer} io
 * @param {Socket} socket
 * @returns {(payload: Object) => void}
 */
const onRemoveSessionPlayer = (io, socket) => (payload) => {
  io.sockets.sockets.get(payload.socketId).disconnect();
};

/**
 * @param {SocketServer} io
 * @param {Socket} socket
 * @returns {(payload: Object) => void}
 */
const onPlayerJoin = (io, socket) => (payload) => {
  socket.join(payload.code);
  console.log(`${payload.name} joined room ${payload.code}`);
  console.log(socket.rooms);
  io.to(payload.code).emit("user-connected", payload);
};

/**
 * @param {SocketServer} io
 * @param {Socket} socket
 * @returns {(payload: Object) => void}
 */
const onPlayerLeave = (io, socket) => (payload) => {
  socket.leave(room);
  socket.broadcast();
  console.log(`${socket.id} left room ${room}`);
  io.to(room).emit("message", `User ${socket.id} has left the room ${room}`);
};

const onPlayerAction = (payload) => {};

module.exports = {
  onSocketConnection,
};
