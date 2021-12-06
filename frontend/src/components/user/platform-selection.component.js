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

export default class PlatformSelection extends Component {
  constructor(props) {
    super(props)

    this.handleLoginToWhiteboard = this.handleLoginToWhiteboard.bind(this);
    this.createNewWhiteboard = this.createNewWhiteboard.bind(this)
    this.onChangeJoinCode = this.onChangeJoinCode.bind(this)
    this.showWhiteboards = this.showWhiteboards.bind(this)

    this.state = {
      content: "",
      boardId: "",
      newJoinCode: "",
      joinCode: "",
      message: "",
      currentUser: AuthService.getCurrentUser(),
      whiteboards: []
    }
  }

  onChangeJoinCode(e) {
    this.setState({
      joinCode: e.target.value
    })
  }

  showWhiteboards() {
    WhiteboardDataService.getAllWhiteboards()
      .then(data => {
        this.setState({
          whiteboards: data
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }


  async createNewWhiteboard() {
    WhiteboardDataService.createWhiteboard()
      .then(res => {
        this.setState({
          boardId: res.data.boardId,
          newJoinCode: res.data.joinCode,
          joinCode: res.data.joinCode,
          message: res.data.message
        })
        this.showWhiteboards()
      })
      .catch(function (error) {
        console.log(error)
      })
  }


  handleLoginToWhiteboard(e) {
    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      WhiteboardDataService.getWhiteboardId(this.state.joinCode).then(
        () => {
          localStorage.setItem("currentWhiteboard", JSON.stringify(this.state.joinCode))

          this.setState({
            loading: WhiteboardDataService.getCurrentWhiteboardAccess(),
            message: WhiteboardDataService.getCurrentWhiteboardAccessMessage()
          })
          if (this.state.loading) {
            this.props.history.push("/whiteboard")
            // window.location.reload();
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


    WhiteboardDataService.getAllWhiteboards()
      .then(data => {
        this.setState({
          whiteboards: data
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  render() {
    return (
      <>
        <div className="list row">
          <div className="col-md-6">
            <div className="card card-container">
              {this.state.currentUser ? (
                <>
                  <header className="jumbotron">
                    <h3>Platform Selection</h3>
                  </header>
                  <button onClick={this.createNewWhiteboard} className="btn btn-outline-success btn-sm">
                    Create New Whiteboard
                  </button>

                  <br />

                  <Form
                    onSubmit={this.handleLoginToWhiteboard}
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

                    <div className="d-grid gap-2">
                      <button className="btn btn-primary btn-block" disabled={this.state.loading}>
                        {this.state.loading && (
                          <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span>Join</span>
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


                  <br />
                  <p><b>Board ID:</b> {this.state.boardId}</p>
                  <p><b>New Join Code:</b> {this.state.newJoinCode}</p>
                  <p><b>Message:</b> {this.state.message}</p>

                </>

              ) : (
                <Redirect to="/home" />
              )}
            </div>
          </div>


          {/* WHITEBOARD LIST */}
          <div className="col-md-6">
            <div className="card card-container">
              {(this.state.currentUser) ? (
                <>
                  {(this.state.whiteboards.length > 0) ? (
                    <>
                      <header className="jumbotron">
                        <h3>Whiteboard List</h3>
                      </header>
                      <br />
                      <strong>Whiteboards</strong>
                      <ul>
                        {this.state.whiteboards &&
                          this.state.whiteboards.map((boards, index) => <li key={index}>{boards}</li>)}
                      </ul>
                    </>
                  ) : (
                    <h3>No whiteboards</h3>
                  )}
                </>
              ) : (
                <h3>User Not Authenticated</h3>
              )}
              <br />
              <button onClick={this.showWhiteboards} className="btn btn-outline-success btn-sm">
                Refresh
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }
}