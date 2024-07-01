const {
  getPlayerPage,
  getPlayerGamePage,
  getPlayerLobbyPage,
} = require("../controllers/player-controller");

const playerRouter = require("express").Router();

playerRouter.get("/", getPlayerPage);
playerRouter.get("/lobby", getPlayerLobbyPage);
playerRouter.get("/game", getPlayerGamePage);

module.exports = {
  playerRouter,
};
