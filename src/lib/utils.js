const { Server: SocketServer, Socket } = require("socket.io");
const { sessions, getUserSession } = require("./sessions.js");
const { getUsername } = require("./users.js");
const jwt = require("jsonwebtoken");

const generateUID = () => {
  return new String(
    Date.now().toString(36) + Math.random().toString(36)
  ).substr(2, 7);
};

/**
 * @param {Function} callback
 * @param {SocketServer} io
 * @param {Socket} socket
 */
const hostProtected = (callback) => (io, socket) => (payload) => {
  let username;
  jwt.verify(socket.request.cookies.token, JWT_SECRET, (error, tokenData) => {
    username = tokenData?.username;
  });

  const session = sessions.get(getUserSession(username));
  if (username === session?.hostUsername) {
    callback(io, socket)(payload);
  } else {
    socket.emit("error", {
      message: "Unauthorized",
    });
  }
};

/**
 * @param {Function} callback
 * @param {SocketServer} io
 * @param {Socket} socket
 */
const playerProtected = (callback) => (io, socket) => (payload) => {
  let username;
  jwt.verify(socket.request.cookies.token, JWT_SECRET, (error, tokenData) => {
    username = tokenData?.username;
  });

  const session = sessions.get(getUserSession(username));
  if (session?.players?.find((player) => player.username === username)) {
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
  playerProtected,
  JWT_SECRET,
};
