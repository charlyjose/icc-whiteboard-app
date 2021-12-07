import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Redirect } from "react-router-dom";

import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import WhiteboardDataService from "../../services/whiteboard/whiteboard.service"


import { InputGroup, FormControl } from 'react-bootstrap';


const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    )
  }
}

export default class PlatformAuthorisation extends Component {
  constructor(props) {
    super(props)

    this.handleWhiteboardAuthorisation = this.handleWhiteboardAuthorisation.bind(this);
    this.onChangeJoinCode = this.onChangeJoinCode.bind(this)
    this.onChangeUsername = this.onChangeUsername.bind(this)

    this.state = {
      joinCode: "",
      currentUser: AuthService.getCurrentUser(),
      username: "",
      message: "",
      loading: false
    }
  }

  onChangeJoinCode(e) {
    this.setState({
      joinCode: e.target.value
    })
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  handleWhiteboardAuthorisation(e) {
    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      WhiteboardDataService.authoriseWhiteboardAccess(this.state.joinCode, this.state.username).then(
        (data) => {
          if (data.status) {
            this.setState({
              loading: !data.status,
              message: data.message
            })
            if (this.state.loading) {
              this.setState({
                message: data.message
              })
              // this.props.history.push("/whiteboard");
              // window.location.reload();
            }
          } 
          else {
            this.setState({
              message: data.message
            })
          }
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          })
        }
      );
    } else {
      this.setState({
        loading: false
      });
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
      <>
        <div className="col-md-12">

          <div className="card card-container">
            {this.state.currentUser ? (
              <>
                <header className="jumbotron">
                  <h3>Platform Authorisation</h3>
                </header>

                <br />

                <Form
                  onSubmit={this.handleWhiteboardAuthorisation}
                  ref={c => {
                    this.form = c;
                  }}
                >
                  <div className="form-group">
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="inputGroup-sizing-default">Join Code</InputGroup.Text>
                      <FormControl
                        aria-label="Join Code"
                        aria-describedby="inputGroup-sizing-default"
                        defaultValue={this.state.joinCode}
                        onChange={this.onChangeJoinCode}
                        required
                      />
                    </InputGroup>
                  </div>

                  <div className="form-group">
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="inputGroup-sizing-default">Username</InputGroup.Text>
                      <FormControl
                        aria-label="User name"
                        aria-describedby="inputGroup-sizing-default"
                        defaultValue={this.state.username}
                        onChange={this.onChangeUsername}
                        required
                      />
                    </InputGroup>
                  </div>

                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-block" disabled={this.state.loading}>
                      {this.state.loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>Authorise</span>
                    </button>
                  </div>

                  {this.state.message && (
                    <div className="form-group">
                      <br />
                      <div className="alert alert-danger" role="alert">
                        {this.state.message}
                      </div>
                    </div>
                  )}
                  <CheckButton
                    style={{ display: "none" }}
                    ref={c => {
                      this.checkBtn = c;
                    }}
                  />

                </Form>
              </>

            ) : (
              <Redirect to="/home" />
            )}
          </div>



        </div>
      </>
    )
  }
}