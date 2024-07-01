require("dotenv").config();

const socketIo = require("socket.io");
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");

const { onSocketConnection } = require("./controllers/socket-controller");
const { indexRouter } = require("./routes");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(indexRouter);
app.use("/public", express.static(path.join(__dirname, "../public/")));

io.on("connection", onSocketConnection(io));

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}.`);
});
