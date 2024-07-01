const { getHomePage, getJoinGamePage } = require("../controllers/index-controller");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);
indexRouter.get("/player/join-game", getJoinGamePage)

module.exports = {
  indexRouter,
};
