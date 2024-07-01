require("dotenv").config();

const socketIo = require("socket.io");
const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");

const { onSocketConnection } = require("./controllers/socket-controller");
const { indexRouter } = require("./routes");

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use("", indexRouter);
app.use("/public", express.static(path.join(__dirname, "../public/")));

io.on("connection", onSocketConnection);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}.`);
});
