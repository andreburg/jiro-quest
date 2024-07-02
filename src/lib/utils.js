const { Server: SocketServer, Socket } = require("socket.io");
const sessions = require("./sessions");

const generateUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * @param {Function} callback
 * @param {SocketServer} io
 * @param {Socket} socket
 */
const hostProtected = (callback) => (io, socket) => (payload) => {
  const session = sessions.get(payload.sessionId);
  if (socket.id === session.hostSocketId) {
    callback(io, socket)(payload);
  } else {
    socket.emit("error", {
      message: "Unauthorized",
    });
  }
};

const JWT_SECRET = process.env.JWT_SECRET + String(generateUID());

module.exports = {
  generateUID,
  hostProtected,
  JWT_SECRET,
};
