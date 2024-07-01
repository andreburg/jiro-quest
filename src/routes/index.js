const { getHomePage } = require("../controllers/index-controller");
const indexRouter = require("express").Router();

indexRouter.get("/", getHomePage);

module.exports = {
  indexRouter,
};
