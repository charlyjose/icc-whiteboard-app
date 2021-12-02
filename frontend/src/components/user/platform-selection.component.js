import React, { Component } from "react";

import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    )
  }
}



export default class PlatformSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      newJoinCode: "",
      joinCode: "",
      message: "",
      currentUser: AuthService.getCurrentUser()
    }
  }

  onChangeJoinCode(e) {
    this.setState({
      joinCode: e.target.value
    });
  }

  handleNewJoin(e) {
    e.preventDefault()

    // Sent create new board request

    // 
  }

  handleJoin() {}







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


          <h3>LOAD: Platform Selection</h3>


        ) : (
          <h3>DO NOT LOAD</h3>
        )}
      </div>
    );
  }
}