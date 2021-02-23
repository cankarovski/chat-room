import React, { Component } from "react";
import "./RoomContainer.css";

export default class RoomContainer extends Component {
  render() {
    return <div className="RoomContainer">{this.props.children}</div>;
  }
}
