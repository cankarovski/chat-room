import React, { Component } from "react";
import "./Chat.css";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      text: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange() {}
  handleSubmit() {}
  render() {
    return (
      <div className="Chat">
        <div className="Chat-text"></div>
        <div className="Chat-input">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="message"></label>
            <input
              id="message"
              name="message"
              value="message"
              onChange={this.handleChange}
            ></input>
            <button>Send</button>
          </form>
        </div>
      </div>
    );
  }
}
