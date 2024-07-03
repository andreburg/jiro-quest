const { Socket, Server } = require("socket.io");
const Game = require("./game");
const Player = require("./player");
const { generateUID } = require("../utils");

class Session {
  /** @param {Server} io @param {string} sessionName @param {string} hostSocketId*/
  constructor(io, sessionName, hostSocketId) {
    this.io = io;
    this.sessionName = sessionName;
    this.host = hostSocketId;
    this.code = generateUID();
    this.players = [];
  }

  /** @param {{socketId: string, name: string}} playerInfo */
  addPlayer(playerInfo) {
    if (this.players.length < 4) {
      this.players = this.players.push(new Player(...playerInfo));
    }
  }

  /** @param {string} socketId */
  removePlayer(socketId) {
    const playerToRemoveIndex = this.players.findIndex(
      (player /** @type {Player} */) => player.socketId == socketId
    );

    if (playerToRemoveIndex != -1) {
      this.players = this.players.splice(playerToRemoveIndex);
    }
  }

  end() {}
}

module.exports = Session;
