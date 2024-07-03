const { getHomePage, getGamePage, getGamePage, getSpectatorPage } = require("../controllers/index-controller");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);
indexRouter.get("/player/game", getGamePage);
indexRouter.get("/spectator/:lobbyId", getSpectatorPage);
indexRouter.get("/player/game", getGamePage);

module.exports = {
  indexRouter,
};
