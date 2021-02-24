import React, { Component } from "react";
import "./ChatApp.css";
import ChatRoom from "./ChatRoom";
import RoomContainer from "./RoomContainer";
import CreateUser from "./CreateUser";
import { io } from "socket.io-client";

export default class ChatApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      username: "John",
      loaded: false,
    };

    this.createUser = this.createUser.bind(this);
  }

  async componentDidMount() {
    console.log("connecting ...");
    let socket = await io("http://localhost:3000/");
    this.setState((prevState) => ({
      ...prevState,
      socket: socket,
      /* loaded: true, */
    }));
    console.log("connected");
  }

  componentWillUnmount() {
    console.log("closing socket ...");
    let socket = this.state.socket;
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

  render() {
    let chats = (
      <div>
        <ChatRoom
          className="ChatApp-room"
          socket={this.state.socket}
          roomName="main"
          userName={this.state.username}
        />
        <ChatRoom
          className="ChatApp-room"
          socket={this.state.socket}
          roomName="general"
          userName={this.state.username}
        />
      </div>
    );
    return (
      <div className="ChatApp">
        <h1 className="ChatApp-heading">CHAT-ROOM</h1>
        {/* <RoomContainer></RoomContainer> */}
        {!this.state.loaded && <CreateUser onCreate={this.createUser} />}
        {this.state.loaded && chats}
      </div>
    );
  }
}
