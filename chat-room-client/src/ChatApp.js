import React, { Component } from "react";
import "./ChatApp.css";
import ChatRoom from "./ChatRoom";
import RoomContainer from "./RoomContainer";
import Chat from "./Chat";

export default class ChatApp extends Component {
  render() {
    return (
      <div className="ChatApp">
        <h1 className="ChatApp-heading">CHAT-ROOM</h1>
        <RoomContainer></RoomContainer>
        <ChatRoom className="ChatApp-room" roomName="main" />
      </div>
    );
  }
}
