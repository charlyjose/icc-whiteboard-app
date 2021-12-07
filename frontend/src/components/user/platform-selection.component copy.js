import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { InputGroup, FormControl } from 'react-bootstrap';

import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import WhiteboardDataService from "../../services/whiteboard/whiteboard.service"


export default class PlatformSelection extends Component {
  constructor(props) {
    super(props)

    this.handleLoginToWhiteboard = this.handleLoginToWhiteboard.bind(this);
    this.createNewWhiteboard = this.createNewWhiteboard.bind(this)
    this.onChangeJoinCode = this.onChangeJoinCode.bind(this)

    this.state = {
      content: "",
      boardId: "",
      newJoinCode: "",
      joinCode: "",
      message: "",
      loading: false,
      currentUser: AuthService.getCurrentUser()
    }
  }

  onChangeJoinCode(e) {
    this.setState({
      joinCode: e.target.value
    })
  }


  async createNewWhiteboard() {
    const res = await WhiteboardDataService.createWhiteboard()
    this.setState({
      boardId: res.data.boardId,
      newJoinCode: res.data.joinCode,
      joinCode: res.data.joinCode,
      message: res.data.message
    })
  }


  handleLoginToWhiteboard(e) {
    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      WhiteboardDataService.getWhiteboardId(this.state.joinCode).then(
        () => {
          this.setState({
            loading: WhiteboardDataService.getCurrentWhiteboardAccess(),
            message: WhiteboardDataService.getCurrentWhiteboardAccessMessage()
          })
          if (this.state.loading) {
            this.props.history.push("/whiteboard");
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
  }

  render() {
    return (
      <div className="col-md-12">
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
                  <label htmlFor="joinCode">Join Code</label>
                  {/* <Input
                    type="text"
                    className="form-control"
                    name="joinCode"
                    value={this.state.joinCode}
                    onChange={this.onChangeJoinCode}
                    validations={[required]}
                  /> */}

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

                {/* <div class="d-grid gap-2 d-md-flex justify-content-md-end">
  <button class="btn btn-primary me-md-2" type="button">Button</button>
  <button class="btn btn-primary" type="button">Button</button>
</div> */}


                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-block" disabled={this.state.loading}>
                    {this.state.loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Join</span>
                  </button>
                </div>

                {/* <div className="form-group">
                  <button
                    className="btn btn-primary btn-block"
                    disabled={this.state.loading}
                  >
                    {this.state.loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Join</span>
                  </button>
                </div> */}

                {this.state.message && (
                  <div className="form-group">
                    <br/>
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
            <h3>DO NOT LOAD</h3>
          )}
        </div>
      </div>
    );
  }
}