import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Whiteboard from "./whiteboard.component";

import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import WhiteboardDataService from "../../services/whiteboard/whiteboard.service";

export default class WhiteboardInitiator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      currentUser: AuthService.getCurrentUser(),
      whiteboardAuth: WhiteboardDataService.getCurrentWhiteboardAccess()
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
        {this.state.currentUser && this.state.whiteboardAuth ? (
          <Whiteboard />
        ) : (
          <Redirect to="/profile" />
        )}
      </div>
    )
  }
}