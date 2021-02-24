import React, { Component } from "react";
import "./ChatRoom.css";
import Chat from "./Chat";
import { io } from "socket.io-client";

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.initRoom = this.initRoom.bind(this);
    let socket;
  }
  componentDidMount() {
    this.socket = this.props.socket;

    this.initRoom();
  }

  async initRoom() {
    /* this.socket.nickname = "john"; */
    await this.socket.emit("join", {
      username: this.props.userName,
      room: this.props.roomName,
    });

    await this.socket.on("message", (data) => {
      if (data.room === this.props.roomName) {
        console.log(data);
        this.setState((prevState) => ({
          messages: [...prevState.messages, data],
        }));
      }
    });
  }

  sendMessage(message) {
    console.log("sending message:", message);
    this.socket.emit(
      "message",
      {
        username: this.props.userName,
        room: this.props.roomName,
        message: message,
      },
      (response) => {
        console.log(response.status);
      }
    );
  }

  render() {
    return (
      <div className="ChatRoom">
        <h3>{this.props.roomName}</h3>
        <Chat onSend={this.sendMessage} />
      </div>
    );
  }
}
