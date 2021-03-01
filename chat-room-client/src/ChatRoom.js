import React, { Component } from "react";
import "./ChatRoom.css";
import Chat from "./Chat";
import Message from "./Message";

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
    console.log("componend did mount! Room:", this.props.roomName);
    this.socket = this.props.socket;

    this.props.onMount(this.props.roomName);
    this.initRoom();
  }

  componentDidUpdate() {
    console.log("componend did update! Room:", this.props.roomName);
    this.scrollToBottom();
  }

  async initRoom() {
    await this.socket.on("message", (data) => {
      if (data.room === this.props.roomName) {
        console.log(data);
        this.setState((prevState) => ({
          messages: [...prevState.messages, { ...data, self: false }],
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
      messages: [...prevState.messages, { ...data, self: true }],
    }));

    this.socket.emit("message", data);
  }

  scrollToBottom() {
    this.messagesEndRef.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    let messages = this.state.messages.map((m, index) => {
      if (m.self) {
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
        {/* {this.props.active && } */}
        <h3 className="ChatRoom-title">{this.props.userName}</h3>
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
