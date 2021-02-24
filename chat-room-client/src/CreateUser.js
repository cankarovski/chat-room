import React, { Component } from "react";

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
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
    this.props.onCreate(this.state.user);
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="user"></label>
          <input
            id="user"
            name="user"
            value={this.state.user}
            onChange={this.handleChange}
          ></input>
          <button>Create</button>
        </form>
      </div>
    );
  }
}
