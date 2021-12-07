import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/user/login.component";
import Register from "./components/user/register.component";
import Home from "./components/user/home.component";
import Profile from "./components/user/profile.component";
import PlatformSelection from './components/user/platform-selection.component'
import PlatformAuthorisation from './components/user/platform-authorisation.component'
import WhiteboardInitiator from "./components/whiteboard/whiteboard-initiator.component";


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      currentWhiteboard: undefined
    }
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      })
    }

    try {
      var currentWhiteboard = JSON.parse(localStorage.getItem('currentWhiteboard'))
      console.log('CURENT: ', currentWhiteboard)
      this.setState({
        currentWhiteboard: currentWhiteboard
      })
    }
    catch {
      this.setState({
        currentWhiteboard: undefined
      })
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const {
      currentUser
    } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Whiteboard App
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {/* {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )} */}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>

              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Log Out
                </a>
              </li>

              <li className="nav-item">
                <Link to={"/platform-selection"} className="nav-link">
                  Platform Selection
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/platform-authorisation"} className="nav-link">
                  Platform Authorisation
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/whiteboard"} className="nav-link">
                  Whiteboard
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/whiteboard"} className="nav-link">
                  { this.state.currentWhiteboard }
                </Link>
              </li>

            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            {/* <Route exact path="/profile" component={WhiteboardList} /> */}
            <Route exact path="/platform-selection" component={PlatformSelection} />
            <Route exact path="/platform-authorisation" component={PlatformAuthorisation} />
            <Route path="/whiteboard" component={WhiteboardInitiator} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;