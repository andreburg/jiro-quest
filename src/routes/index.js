const { getHomePage, getGamePage } = require("../controllers/index-controller");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);
indexRouter.get("/player/game", getGamePage);

module.exports = {
  indexRouter,
};
