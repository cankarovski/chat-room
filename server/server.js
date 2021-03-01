const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const socket = require("socket.io");

const app = express();

app.use(express.static(path.join("../chat-room-client/", "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join("../chat-room-client/", "build", "index.html"), {
    root: __dirname,
  });
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
const io = socket(server);

let users = new Array();

findUser = (username) => {
  return users.find((u) => {
    return u.username === username;
  });
};

findId = (id) => {
  return users.find((u) => {
    return u.id === id;
  });
};

deleteUser = (id) => {
  let newUsers = users.filter((u) => {
    return u.id !== id;
  });
  users = newUsers;
};

io.on("connection", function (socket) {
  console.log(`socket ${socket.id} connected!`);

  socket.on("join", function (data) {
    let user = findId(socket.id);
    if (user) {
      user.rooms = socket.rooms;
    } else {
      users.push({
        id: socket.id,
        username: data.username,
        rooms: socket.rooms,
      });
    }

    console.log(`User ${data.username} joined room ${data.room}`);
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
    // send message to all users in room except the sender
    socket.to(data.room).emit("message", { ...data });
  });

  socket.on("leave", function (data) {
    socket.to(data.room).emit("message", {
      room: data.room,
      username: "Notification",
      message: `User ${data.username} left room ${data.room}`,
    });
  });

  socket.on("disconnecting", () => {
    let user = findId(socket.id);

    if (user) {
      socket.rooms.forEach((room) => {
        data = {
          room: room,
          username: "Notification",
          message: `User ${user.username} left room ${room}`,
        };
        io.to(room).emit("message", data);
      });
    }

    deleteUser(socket.id);
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected!`);
  });
});
