import React, { Component } from "react";
import "./ChatRoom.css";
import Chat from "./Chat";
import { io } from "socket.io-client";

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let socket = io("http://localhost:3000/");
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("main", "message");

      socket.on("main", (arg) => {
        console.log(arg);
      });
    });
  }
  render() {
    return (
      <div className="ChatRoom">
        <h3>{this.props.roomName}</h3>
        <Chat />
      </div>
    );
  }
}
