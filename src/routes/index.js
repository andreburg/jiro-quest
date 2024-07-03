const {
  getHomePage,
  getJoinPage,
  createSession,
  getSignInPage,
  signInUser,
  joinSession,
  getGamePage,
  getSpectatorPage
} = require("../controllers/index-controller");
const { verifyToken } = require("../middleware/cookie");
const jwt = require("jsonwebtoken");
const indexRouter = require("express").Router();

indexRouter.use(verifyToken);
indexRouter.get("/", getHomePage);
indexRouter.get("/player/game", getGamePage);
indexRouter.get("/spectator/:lobbyId", getSpectatorPage);
indexRouter.get("/player/game", getGamePage);
indexRouter.get("/create", createSession);
indexRouter.get("/join", getJoinPage);
indexRouter.get("/signin", getSignInPage);
indexRouter.post("/signin", signInUser);
indexRouter.get("/lobby/:sessionId", joinSession);

module.exports = {
  indexRouter,
};
