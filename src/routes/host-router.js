const {
  getHostPage,
  getHostGamePage,
  getHostLobbyPage,
} = require("../controllers/host-controller");

const hostRouter = require("express").Router();

hostRouter.get("/", getHostPage);
hostRouter.get("/lobby", getHostGamePage);
hostRouter.get("/game", getHostLobbyPage);

module.exports = {
  hostRouter,
};
