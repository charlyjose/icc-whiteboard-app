import React, { Component } from "react";

import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";

export default class BoardUser extends Component {
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
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
          {console.log(this.state.content)}
          {console.log(this.state.currentUser)}
        </header>
        {this.state.currentUser ? (
          <h3>LOAD</h3>
        ) : (
          <h3>DO NOT LOAD</h3>
        )}

      </div>
    );
  }
}