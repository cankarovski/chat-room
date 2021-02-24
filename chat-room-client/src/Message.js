import React, { Component } from "react";
import "./Message.css";

export default class Message extends Component {
  render() {
    return (
      <div className={`Message ${this.props.messageStyle}`}>
        <h4 className="Message-sender">{this.props.sender}</h4>
        <p className="Message-content">{this.props.message}</p>
      </div>
    );
  }
}
