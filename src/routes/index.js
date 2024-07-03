const {
  getHomePage,
  getJoinPage,
  createSession,
  getSignInPage,
  signInUser,
  joinSession,
  getGamePage,
  getSpectatorPage,
  getLossPage,
  getWinPage,
  spectateSession,
} = require("../controllers/index-controller");
const { verifyToken } = require("../middleware/cookie");
const jwt = require("jsonwebtoken");
const indexRouter = require("express").Router();

indexRouter.use(verifyToken);
indexRouter.get("/", getHomePage);
indexRouter.get("/loss", getLossPage);
indexRouter.get("/win", getWinPage);
indexRouter.get("/player/game", getGamePage);
indexRouter.get("/spectator/:lobbyId", getSpectatorPage);
indexRouter.get("/player/game", getGamePage);
indexRouter.get("/lobby/:sessionId/spectate", spectateSession);
indexRouter.get("/create", createSession);
indexRouter.get("/join", getJoinPage);
indexRouter.get("/signin", getSignInPage);
indexRouter.post("/signin", signInUser);
indexRouter.get("/lobby/:sessionId", joinSession);

module.exports = {
  indexRouter,
};
