import React, { Component } from "react";
import "../../styles/login.css";
import { withRouter } from "react-router-dom";
import { apiUrl } from "../../shared/vars";
import { connect } from "react-redux";
import {
  helpdeskUser,
  changeLoginState,
} from "../../redux/actions/userActions";
import axios from "axios";

class Login extends Component {
  state = {
    currentView: "signUp",
    isLoading: true,
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    enterpriseName: "",
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    enterpriseNameError: "",
    currentError: "",
  };

  handleChange = async (e) => {
    e.persist()
    await this.setState({ [e.target.name]: e.target.value });
    const {
      name,
      password,
      email,
      confirmPassword,
      enterpriseName,
      currentView,
    } = this.state;
    await this.setState({
      nameError: "",
      enterpriseNameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
    });
    if (currentView === "signUp") {
      if (
        name.length > 3 &&
        enterpriseName.length > 3 &&
        /.+@.+\.[A-Za-z]+$/.test(email) &&
        password === confirmPassword &&
        password.length > 6
      ) {
        this.setState({ isLoading: false,currentError:'' });
        return;
      } else if (
        name.length >= 1 &&
        enterpriseName.length >= 1 &&
        email.length > 0 &&
        password.length >= 1 &&
        confirmPassword.length >= 1
      ) {
        if (name.length <= 3) {
          this.setState({ nameError: `Name should be greater than 3 letter` });
          this.setState({ isLoading: true });
        }
        if (enterpriseName.length <= 3) {
          this.setState({
            enterpriseNameError: `Enterprise Name should be greater than 3 letter`,
          });
          this.setState({ isLoading: true });
        }
        if (!/.+@.+\.[A-Za-z]+$/.test(email)) {
          this.setState({ emailError: `Invalid email` });
        }
        if (password.length <= 6) {
          this.setState({
            passwordError: "minimum password length 7 character",
          });
          this.setState({ isLoading: true });
        }
        if (password !== confirmPassword) {
          this.setState({
            confirmPasswordError: `confirm password doesn't match`,
          });
          this.setState({ isLoading: true });
        }
        if (e.target) {
          if (e.target.name === "name") {
            this.setState({ currentError: this.state.nameError });
          }
          if (e.target.name === "enterpriseName") {
            this.setState({ currentError: this.state.enterpriseNameError });
          }
          if (e.target.name === "email") {
            this.setState({ currentError: this.state.emailError });
          }
          if (e.target.name === "password") {
            this.setState({ currentError: this.state.passwordError });
          }
          if (e.target.name === "confirmPassword") {
            this.setState({ currentError: this.state.confirmPasswordError });
          }
        }
      } else {
        this.setState({ isLoading: true });
      }
    }
    if (currentView === "logIn") {
      if (/.+@.+\.[A-Za-z]+$/.test(email) && password.length > 6) {
        this.setState({ isLoading: false,currentError:'' });
        return;
      }
      if (email.length > 0 && password.length > 1) {
        if (!/.+@.+\.[A-Za-z]+$/.test(email)) {
          this.setState({ emailError: `Invalid email` });
          this.setState({ isLoading: true });
        }
        if (password.length <= 6) {
          this.setState({
            passwordError: `minimum password length 7 character`,
          });
          this.setState({ isLoading: true });
        }
        if (e.target) {
          if (e.target.name === "email") {
            this.setState({ currentError: this.state.emailError });
          }
          if (e.target.name === "password") {
            this.setState({ currentError: this.state.passwordError });
          }
        }
      } else {
        this.setState({ isLoading: true });
      }
    }
  };

  changeView = (view) => {
    this.setState({
      currentView: view,
    });
  };

  login = async () => {
    try {
      this.setState({ isLoading: true });
      console.log(apiUrl);
      const { email, password } = this.state;
      const res = await axios.post(`${apiUrl}/api/auth/enterprise/login`, {
        email: email,
        password: password,
      });
      if (res.data.error) {
        window.alert(res.data.error);
        return;
      }
      if (!res.data.user.isAdmin) {
        if (!res.headers["x-auth-token"]) {
          window.alert("Ask your enterprise admin to add twitter account");
          this.props.changeLoginState(false, null, "");
          return;
        } else if (res.headers["x-auth-token"]) {
          this.props.helpdeskUser(res.data.user);
          this.props.changeLoginState(true, null, res.headers["x-auth-token"]);
          this.props.history.push("/dashboard");
          return;
        } else if (res.data) {
          this.props.helpdeskUser(res.data.user);
          this.props.history.push("/");
        }
      } else if (res.data.user.isAdmin) {
        if (!res.headers["x-auth-token"]) {
          console.log(res.data);
          this.props.helpdeskUser(res.data.user);
          this.props.history.push("/");
          return;
        } else if (res.headers["x-auth-token"]) {
          this.props.helpdeskUser(res.data.user);
          this.props.changeLoginState(true, null, res.headers["x-auth-token"]);
          this.props.history.push("/dashboard");
          return;
        } else if (res.data) {
          this.props.helpdeskUser(res.data.user);
          this.props.history.push("/");
        }
      }
    } catch (error) {
      console.log(error.message);
      window.alert("invalid credentials");
    }
  };
  verify = async () => {
    try {
      this.setState({ isLoading: true });
      const { email, password, name, enterpriseName } = this.state;
      const res = await axios.post(`${apiUrl}/api/auth/enterprise/register`, {
        name: name,
        email: email,
        password: password,
        enterpriseName: enterpriseName,
      });
      if (res.data.error) {
        window.alert(res.data.error);
        return;
      } else if (res.data) {
        this.props.helpdeskUser(res.data.user);
        this.props.history.push("/");
      }
    } catch (error) {
      console.log(error.message);
      window.alert(error.message);
    }
  };
  currentView = () => {
    switch (this.state.currentView) {
      case "signUp":
        return (
          <form>
            {this.state.currentError ? (
              <div
                style={{
                  backgroundColor: "red",
                  width: "100%",
                  height: "50px",
                  borderRadius: "20px",
                  color: "white",
                  fontWeight: "bolder",
                  textAlign: "center",
                  paddingTop: "10px",
                }}
              >
                <p>
                  {" "}
                  <span role="img" aria-label="">
                    ❎{" "}
                  </span>{" "}
                  {this.state.currentError}
                </p>
              </div>
            ) : (
              ""
            )}

            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label htmlFor="username">* Enterprise name:</label>
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.enterpriseName}
                    name="enterpriseName"
                    id="enterprisename"
                    required
                    minlength="3"
                    onClick={() =>
                      this.setState({
                        currentError: this.state.enterpriseNameError,
                      })
                    }
                    className={this.state.enterpriseNameError ? "redInput" : ""}
                  />
                </li>
                <li>
                  <label htmlFor="username">* name:</label>
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.name}
                    name="name"
                    id="username"
                    required
                    className={this.state.nameError ? "redInput" : ""}
                    onClick={() =>
                      this.setState({ currentError: this.state.nameError })
                    }
                  />
                </li>
                <li>
                  <label htmlFor="email">* Email:</label>
                  <input
                    type="email"
                    name="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                    id="email"
                    required
                    className={this.state.emailError ? "redInput" : ""}
                    onClick={() =>
                      this.setState({ currentError: this.state.emailError })
                    }
                  />
                </li>
                <li>
                  <label htmlFor="password">* Password:</label>
                  <input
                    type="password"
                    name="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    id="password"
                    required
                    className={this.state.passwordError ? "redInput" : ""}
                    minlength="7"
                    onClick={() =>
                      this.setState({ currentError: this.state.passwordError })
                    }
                  />
                </li>
                <li>
                  <label htmlFor="confirmPassword">* Confirm password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    onChange={this.handleChange}
                    value={this.state.confirmPassword}
                    id="confirmPassword"
                    required
                    className={
                      this.state.confirmPasswordError ? "redInput" : ""
                    }
                    minlength="7"
                    onClick={() =>
                      this.setState({
                        currentError: this.state.confirmPasswordError,
                      })
                    }
                  />
                </li>
              </ul>
            </fieldset>
            <button
              disabled={this.state.isLoading}
              onClick={() => this.verify()}
            >
              Submit
            </button>
            <button type="button" onClick={() => this.changeView("logIn")}>
              Have an Account?
            </button>
          </form>
        );
      case "logIn":
        return (
          <form>
            {this.state.currentError ? (
              <div
                style={{
                  backgroundColor: "red",
                  width: "100%",
                  height: "50px",
                  borderRadius: "20px",
                  color: "white",
                  fontWeight: "bolder",
                  textAlign: "center",
                  paddingTop: "10px",
                }}
              >
                <p>
                  <span role="img" aria-label="">
                    ❎{" "}
                  </span>
                  {this.state.currentError}
                </p>
              </div>
            ) : (
              ""
            )}
            <h2>Welcome Back!</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                  <label htmlFor="email">* Email:</label>
                  <input
                    type="email"
                    id="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                    name="email"
                    required
                    className={this.state.emailError ? "redInput" : ""}
                    onClick={() =>
                      this.setState({ currentError: this.state.emailError })
                    }
                  />
                </li>
                <li>
                  <label htmlFor="password">* Password:</label>
                  <input
                    type="password"
                    id="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    name="password"
                    required
                    minlength="7"
                    className={this.state.passwordError ? "redInput" : ""}
                    onClick={() =>
                      this.setState({ currentError: this.state.passwordError })
                    }
                  />
                </li>
                <li>
                  <i />
                </li>
              </ul>
            </fieldset>
            <button
              disabled={this.state.isLoading}
              onClick={() => this.login()}
            >
              Login
            </button>
            <button type="button" onClick={() => this.changeView("signUp")}>
              Create an Account
            </button>
          </form>
        );
      default:
        break;
    }
  };
  render() {
    return <section id="entry-page">{this.currentView()}</section>;
  }
}

export default connect(null, { changeLoginState, helpdeskUser })(
  withRouter(Login)
);
