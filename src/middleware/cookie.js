const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../lib/utils");

const verifyToken = async (req, res, next) => {
  jwt.verify(req.cookies["token"], JWT_SECRET, (error, tokenData) => {
    if (!error) {
      req.data = {
        ...req.data,
        tokenData,
      };
      next();
    } else {
      if (
        req.path === "/signin" ||
        new String(req.path).startsWith("/public")
      ) {
        next();
      } else {
        res.redirect("/signin");
      }
    }
  });
};

module.exports = {
  verifyToken,
};
