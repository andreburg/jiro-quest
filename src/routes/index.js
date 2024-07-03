const { getHomePage, getJoinGamePage, getGamePage } = require("../controllers/index-controller");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);
indexRouter.get("/player/join-game", getJoinGamePage)
indexRouter.get("/player/game", getGamePage);

module.exports = {
  indexRouter,
};
