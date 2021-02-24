import React, { Component } from "react";
import "./ChatRoom.css";
import Chat from "./Chat";
import Message from "./Message";
import { io } from "socket.io-client";

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.initRoom = this.initRoom.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    let socket;
  }
  componentDidMount() {
    this.socket = this.props.socket;

    this.initRoom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
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

    let data = {
      username: this.props.userName,
      room: this.props.roomName,
      message: message,
    };

    this.setState((prevState) => ({
      messages: [...prevState.messages, data],
    }));

    this.socket.emit("message", data);
  }

  scrollToBottom() {
    this.messagesEndRef.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    let messages = this.state.messages.map((m, index) => {
      if (m.username === this.props.userName) {
        return (
          <Message
            key={index}
            sender={m.username}
            message={m.message}
            messageStyle="Message-self"
          />
        );
      } else if (m.username === "Notification") {
        return (
          <Message
            key={index}
            sender={m.username}
            message={m.message}
            messageStyle="Message-notification"
          />
        );
      } else {
        return (
          <Message
            key={index}
            sender={m.username}
            message={m.message}
            messageStyle="Message-friend"
          />
        );
      }
    });
    return (
      <div className="ChatRoom">
        <h3 className="ChatRoom-title">
          {this.props.roomName}: {this.props.userName}
        </h3>
        <div className="ChatRoom-messages">
          <div className="ChatRoom-messages-list">
            {messages}
            <div
              ref={(el) => {
                this.messagesEndRef = el;
              }}
            />
          </div>
        </div>
        <Chat onSend={this.sendMessage} />
      </div>
    );
  }
}
