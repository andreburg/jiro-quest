const { getHomePage, getJoinGamePage, getCreateGame } = require("../controllers/index-controller");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);
indexRouter.get("/player/join-game", getJoinGamePage)

indexRouter.get("/host/create-game", getCreateGame)

module.exports = {
  indexRouter,
};
