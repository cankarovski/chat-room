import React, { Component } from "react";
import "./ChatApp.css";
import ChatRoom from "./ChatRoom";
import RoomContainer from "./RoomContainer";
import CreateUser from "./CreateUser";
import { io } from "socket.io-client";
import { Beforeunload } from "react-beforeunload";

export default class ChatApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      username: null,
      loaded: false,
      activeRoom: "main",
    };

    this.createUser = this.createUser.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }

  async componentDidMount() {
    console.log("connecting ...");
    let socket;
    socket = await io();
    this.setState((prevState) => ({
      ...prevState,
      socket: socket,
      /* loaded: true, */
    }));
    console.log("connected");
  }

  async componentWillUnmount() {
    this.cleanUp();
  }

  async cleanUp() {
    console.log("closing socket ...");
    let socket = this.state.socket;

    await this.leaveChat();

    socket.close();
    this.setState((prevState) => ({
      ...prevState,
      socket: null,
      loaded: false,
    }));
  }

  createUser(user) {
    this.setState((prevState) => ({
      ...prevState,
      username: user,
      loaded: true,
    }));
  }

  joinRoom(room) {
    if (this.state.username !== null) {
      this.state.socket.emit("join", {
        username: this.state.username,
        room: room,
      });
    }

    /* this.state.socket.on("disconnect", () => {
      this.setState({
        loaded: false,
      });
    }); */
  }

  leaveChat() {
    this.state.socket.emit("leave", {
      username: this.state.username,
      room: this.state.activeRoom,
    });
  }

  render() {
    let chats = (
      <ChatRoom
        className="ChatApp-room"
        socket={this.state.socket}
        roomName="main"
        userName={this.state.username}
        onMount={this.joinRoom}
      />
    );
    return (
      <div className="ChatApp">
        <div className="ChatApp-sidebar">
          <h1 className="ChatApp-heading">CHAT-ROOM</h1>
        </div>

        {this.state.loaded ? (
          <ChatRoom
            className="ChatApp-room"
            socket={this.state.socket}
            roomName="main"
            userName={this.state.username}
            onMount={this.joinRoom}
          />
        ) : (
          <CreateUser onCreate={this.createUser} />
        )}
      </div>
    );
  }
}
