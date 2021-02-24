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

/* io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join("main");
  console.log("connected, id:", socket.handshake.query);

  socket.on("main", (arg) => {
    console.log(arg);
    socket.broadcast.emit("main", arg);
  });
}); */

io.on("connection", function (socket) {
  console.log(`socket ${socket.id} connected!`);

  socket.on("join", function (data) {
    /* console.log(socket); */
    console.log(`socket ${data.username} joined room ${data.room}`);
    socket.join(data.room);

    socket.to(data.room).emit("message", {
      room: data.room,
      username: "Notification",
      message: `User ${data.username} joined room ${data.room}`,
    });
  });

  socket.on("message", function (data) {
    console.log(socket.rooms);
    console.log(data);
    socket.to(data.room).emit("message", { ...data });
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected!`);
  });
});
