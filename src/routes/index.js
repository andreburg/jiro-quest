const { getHomePage } = require("../controllers/index-controller");
const { hostRouter } = require("./host-router");
const { playerRouter } = require("./player-router");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);
indexRouter.use("/host", hostRouter);
indexRouter.use("/player", playerRouter);

module.exports = {
  indexRouter,
};
