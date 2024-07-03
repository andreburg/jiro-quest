const { getHomePage, getGamePage, getSpectatorPage } = require("../controllers/index-controller");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);
indexRouter.get("/player/game", getGamePage);
indexRouter.get("/spectator/:lobbyId", getSpectatorPage);

module.exports = {
  indexRouter,
};
