const { Socket, Server: SocketServer } = require("socket.io");
const { generateUID, hostProtected, JWT_SECRET } = require("../lib/utils");
const sessions = require("../lib/sessions");
const { users } = require("../lib/users");
const jwt = require("jsonwebtoken");

/** @param {SocketServer} io @returns {(socket: Socket) => void} */
const onSocketConnection = (io) => (socket) => {
  const socketRouter = {
    // Session Actions
    createSession: onCreateSession,
    endSession: hostProtected(onEndSession),
    joinSession: onJoinSession,
    leaveSession: onLeaveSession,

    // Host Actions
    startGame: hostProtected(onStartGame),
    endGame: hostProtected(onEndGame),
    updateGameState: hostProtected(onUpdateGameState),
    kickSocket: hostProtected(onKickSocket),

    // Client Actions
    auth: onAuth,
    signIn: onSignIn,
  };

  for (let key in socketRouter) {
    let func = socketRouter[key];
    socket.on(key, func(io, socket));
  }
};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onSignIn = (io, socket) => (payload) => {
  if (users.has(payload.username)) {
    socket.emit("error", {
      message: "Username already taken.",
    });
    return;
  } else {
    users.set(payload.username, null);
    socket.emit("authorized", jwt.sign(payload.username, JWT_SECRET));
    console.log(payload.username);
  }
};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onAuth = (io, socket) => (payload) => {
  jwt.verify(payload.token, JWT_SECRET, (err, decoded) => {
    if (err) {
      socket.emit("authorized", {
        error: "Unauthorized",
      });
    } else {
      users.set(decoded, socket.id);
      socket.emit("authorized", {
        data: {
          username: decoded,
        },
      });
    }
  });
};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onCreateSession = (io, socket) => (payload) => {
  const sessionId = generateUID();
  socket.join(sessionId);
  sessions.set(sessionId, {
    hostUsername: socket.id,
    sessionName: payload.sessionName,
    status: "lobby",
    playerUsernames: [],
  });
};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onEndSession = (io, socket) => (payload) => {
  io.in(payload.sessionId).disconnectSockets();
  sessions.delete(payload.sessionId);
};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onJoinSession = (io, socket) => (payload) => {
  const username = new Array(users.entries()).find(
    ([key, value]) => value === socket.id
  );

  const session = sessions.get(payload.sessionId);
  if (!session) {
    socket.emit("error", {
      message: "Session does not exist.",
    });
    return;
  }

  if (session.status !== "lobby") {
    socket.emit("error", {
      message: "Unable to join ongoing game.",
    });
    return;
  }

  if (session.sockets.length >= 4) {
    socket.emit("error", {
      message: "Unable to join full session.",
    });
    return;
  }

  socket.join(payload.sessionId);
  session.playerUsernames.push(username);
  io.to(payload.code).emit("playerJoined", {
    socketId: socket.id,
    name: payload.name,
  });
};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onLeaveSession = (io, socket) => (payload) => {
  const session = sessions.get(payload.sessionId);
  socket.leave(payload.sessionId);
  const socketIndex = session.sockets.find(
    (socketId) => socketId === socket.id
  );
  if (socketIndex != -1) {
    session.sockets = session.sockets.splice(socketIndex);
  } else {
    socket.emit("Error", {
      message: "Not a member of the session.",
    });
  }
  io.to(payload.sessionId).emit("playerLeft", {
    socketId: socket.id,
  });
  socket.disconnect();
};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onStartGame = (io, socket) => (payload) => {};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onEndGame = (io, socket) => (payload) => {};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onUpdateGameState = (io, socket) => (payload) => {
  const sessionId = generateUID();
  sessions.set(sessionId, {
    hostSocketId: socket.id,
    sessionName: payload.sessionName,
  });
  socket.join(sessionId);
};

/** @param {SocketServer} io @param {Socket} socket @returns {(payload: Object) => void} */
const onKickSocket = (io, socket) => (payload) => {
  const session = sessions.get(payload.sessionId);
  const socketToKick = io.sockets.sockets.get(payload.socketId);
  socketToKick.leave(payload.sessionId);
  const socketIndex = session.sockets.find(
    (socketId) => socketId === socketToKick.id
  );
  if (socketIndex != -1) {
    session.sockets = session.sockets.splice(socketIndex);
  } else {
    socket.emit("Error", {
      message: "Not a member of the session.",
    });
  }
  io.to(payload.sessionId).emit("playerLeft", {
    socketId: socket.id,
  });
  socket.disconnect();
  io.sockets.sockets.get(payload.socketId).disconnect();
};

module.exports = {
  onSocketConnection,
};
