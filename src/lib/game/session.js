const { Socket } = require("socket.io");
const Game = require("./game");
const Player = require("./player");

class Session {
  /** @param {Socket} socket @param {{sessionName: string, code: string}} sessionInfo */
  constructor(socket, sessionInfo) {
    this.socket = socket;
    this.sessionName = sessionInfo.sessionName;
    this.code = sessionInfo.code;
    this.players = [];
    /** @type {Game} */
    this.game = null;
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

  getPlayer(socketId) {
    return this.players.find((player) => player.socketId === socketId);
  }

  startGame() {
    this.game = new Game();
  }

  endGame() {
    this.game.end();
  }

  end() {}
}

module.exports = Session;
