import React, { Component } from "react";

import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import Whiteboard from "./whiteboard.component";


export default class WhiteboardInitiator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      currentUser: AuthService.getCurrentUser()
    }
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        })
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        })
      }
    )
  }

  render() {
    return (
      <div className="container">
        {this.state.currentUser ? (
          <Whiteboard />
        ) : (
          <h3>DO NOT LOAD: {this.state.content}</h3>
        )}
      </div>
    );
  }
}