import React, { Component } from "react";
import "./ChatApp.css";
import ChatRoom from "./ChatRoom";
import CreateUser from "./CreateUser";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

export default class ChatApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      username: null,
      loaded: false,
      rooms: [
        { name: "General", active: true },
        { name: "Politics", active: false },
      ],
    };

    this.createUser = this.createUser.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.toggleRoom = this.toggleRoom.bind(this);
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
      room: this.state
        .activeRoom /* fix this, there is no activeRoom in state */,
    });
  }

  toggleRoom(evt) {
    let rooms = this.state.rooms;
    rooms.forEach((r) => {
      r.name === evt.target.innerText ? (r.active = true) : (r.active = false);
    });

    this.setState((prevState) => ({
      ...prevState,
      rooms: rooms,
    }));
  }

  render() {
    let activeRoomName = this.state.rooms.find((r) => {
      return r.active === true;
    });

    /* let room = (
      <ChatRoom
        className="ChatApp-room"
        socket={this.state.socket}
        roomName={activeRoomName.name}
        userName={this.state.username}
        onMount={this.joinRoom}
      />
    ); */

    let rooms = this.state.rooms.map((r) => {
      return (
        <ChatRoom
          key={uuidv4()}
          className="ChatApp-room"
          socket={this.state.socket}
          roomName={r.name}
          userName={this.state.username}
          onMount={this.joinRoom}
        />
      );
    });

    console.log(rooms);

    let activeRoom = rooms.find((r) => {
      return r.props.roomName === activeRoomName.name;
    });
    console.log(activeRoom);

    return (
      <div className="ChatApp">
        {this.state.loaded ? (
          <div className="ChatApp-container">
            <div className="ChatApp-sidebar">
              <h1 className="ChatApp-heading">
                CHAT<span>ROOM</span>_
              </h1>
              <ul className="ChatApp-roomList">
                {this.state.rooms.map((r) => {
                  return (
                    <li
                      key={uuidv4()}
                      onClick={this.toggleRoom}
                      className={`ChatApp-roomList-${r.active}`}
                    >
                      {r.name}
                    </li>
                  );
                })}
              </ul>
            </div>
            {activeRoom}
          </div>
        ) : (
          <CreateUser onCreate={this.createUser} />
        )}
      </div>
    );
  }
}
