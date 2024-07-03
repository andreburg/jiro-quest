require("dotenv").config();

const socketIo = require("socket.io");
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const { onSocketConnection } = require("./controllers/socket-controller");
const { indexRouter } = require("./routes");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./lib/utils");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.use((socket, next) => {
  const req = socket.request;
  const res = req.res || {};

  cookieParser()(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(indexRouter);
app.use("/public", express.static(path.join(__dirname, "../public/")));

io.on("connection", onSocketConnection(io));

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}.`);
});
