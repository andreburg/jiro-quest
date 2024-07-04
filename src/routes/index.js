const {
  getHomePage,
  getJoinPage,
  createSession,
  getSignInPage,
  signInUser,
  joinSession,
  spectateSession,
  getSessions,
} = require("../controllers/index-controller");
const { verifyToken } = require("../middleware/cookie");
const indexRouter = require("express").Router();

indexRouter.use(verifyToken);
indexRouter.get("/", getHomePage);
indexRouter.get("/lobby/:sessionId/spectate", spectateSession);
indexRouter.get("/create", createSession);
indexRouter.get("/join", getJoinPage);
indexRouter.get("/signin", getSignInPage);
indexRouter.post("/signin", signInUser);
indexRouter.get("/lobby/:sessionId", joinSession);
indexRouter.get("/sessions", getSessions);

module.exports = {
  indexRouter,
};
