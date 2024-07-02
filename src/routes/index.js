const {
  getHomePage,
  getJoinPage,
  getCreatePage,
  getSignInPage,
} = require("../controllers/index-controller");
const { users } = require("../lib/users");
const { hostRouter } = require("./host-router");
const { playerRouter } = require("./player-router");
const jwt = require("jsonwebtoken");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);
indexRouter.get("/create", getJoinPage);
indexRouter.get("/join", getCreatePage);
indexRouter.get("/signin", getSignInPage);

indexRouter.use("/host", hostRouter);
indexRouter.use("/player", playerRouter);

module.exports = {
  indexRouter,
};
