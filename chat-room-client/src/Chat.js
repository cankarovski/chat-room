import React, { Component } from "react";
import "./Chat.css";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }
  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onSend(this.state.message);
    this.setState({
      message: "",
    });
  }
  render() {
    return (
      <div className="Chat">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="message"></label>
          <input
            id="message"
            name="message"
            value={this.state.message}
            onChange={this.handleChange}
          ></input>
          <button>Send</button>
        </form>
      </div>
    );
  }
}
