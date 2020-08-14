import React, { Component } from "react";
import "../../styles/login.css";
import { withRouter } from "react-router-dom";
import api from "../../shared/customAxios";
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
  };

  handleChange = async (e) => {
    await this.setState({ [e.target.name]: e.target.value });
    console.log(this.state)
    const {
      name,
      password,
      email,
      confirmPassword,
      enterpriseName,
      currentView
    } = this.state;
    if(currentView=='signUp'){
      if (
        name.length > 3 &&
        enterpriseName.length > 3 &&
        /.+@.+\.[A-Za-z]+$/.test(email) &&
        password === confirmPassword &&
        password.length > 6
      ) {
        this.setState({ isLoading: false });
        return
      }
      else{
        this.setState({ isLoading: true });
      }
    }
    if(currentView=='logIn'){
      if (
        /.+@.+\.[A-Za-z]+$/.test(email) &&
        password.length > 6
      ) {
        this.setState({ isLoading: false });
        return
      }
      else{
        this.setState({ isLoading: true });
      }
    }
    

  };

  componentDidUpdate(prevProp, prevState) {
    if (this.state !== prevState) {
      
      // console.log(this.state.isLoading);
    }
  }

  changeView = (view) => {
    this.setState({
      currentView: view,
    });
  };

  login = async () => {
    try {
      this.setState({ isLoading: true });
      const {email,password} = this.state
      const res = await axios.post(`${apiUrl}/api/auth/enterprise/login`, {
        email: email,
        password: password,
      });
      console.log(res);
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
    } catch (error) {
      console.log(error.message);
      window.alert("invalid credentials");
    }
  };
  verify = async () => {
    try {
      this.setState({isLoading:true});
      const {email,password,name, enterpriseName} = this.state

      const res = await axios.post(`${apiUrl}/api/auth/enterprise/register`, {
        name: name,
        email: email,
        password: email,
        enterpriseName: enterpriseName,
      });
      if (res.data) {
        this.props.helpdeskUser(res.data.user);
        this.props.history.push("/");
      }
    } catch (error) {
      console.log(error.message);
      window.alert(error.message)
    }
  };
  currentView = () => {
    switch (this.state.currentView) {
      case "signUp":
        return (
          <form>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label htmlFor="username">Enterprise name:</label>
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.enterpriseName}
                    name="enterpriseName"
                    id="enterprisename"
                    required
                  />
                </li>
                <li>
                  <label htmlFor="username">User name:</label>
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.name}
                    name="name"
                    id="username"
                    required
                  />
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    name="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                    id="email"
                    required
                  />
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    name="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    id="password"
                    required
                  />
                </li>
                <li>
                  <label htmlFor="confirmPassword">Confirm password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    onChange={this.handleChange}
                    value={this.state.confirmPassword}
                    id="confirmPassword"
                    required
                  />
                </li>
              </ul>
            </fieldset>
            <button disabled={this.state.isLoading} onClick={()=>this.verify()}>Submit</button>
            <button type="button" onClick={() => this.changeView("logIn")}>
              Have an Account?
            </button>
          </form>
        );
        break;
      case "logIn":
        return (
          <form>
            <h2>Welcome Back!</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                    name="email"
                    required
                  />
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    name="password"
                    required
                  />
                </li>
                <li>
                  <i />
                </li>
              </ul>
            </fieldset>
            <button disabled={this.state.isLoading} onClick={()=>this.login()}>Login</button>
            <button type="button" onClick={() => this.changeView("signUp")}>
              Create an Account
            </button>
          </form>
        );
        break;
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
