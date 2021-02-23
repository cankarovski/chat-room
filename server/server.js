const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const socket = require("socket.io");

const app = express();

app.use(express.static(path.join("../chat-room-client/", "build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
const io = socket(server);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join("main");
  console.log("connected, id:", socket.handshake.query);

  socket.on("main", (arg) => {
    console.log(arg);
    socket.broadcast.emit("main", arg);
  });
});
