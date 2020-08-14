import AppRouter from "./AppRouter";
import React, { Component } from "react";
import { connect } from "react-redux"
import { changeLoginState } from './redux/actions/userActions'
import api from "./shared/customAxios";
import { apiUrl } from "./shared/vars";
import Progress from "./components/Progress/Progress";

class App extends Component {
  state = {
    loading: false
  };
  componentDidMount() {
    this.setState({ loading: true });
    this.init();
  }
  init = async () => {
    console.log("APP - INIT");
    //get jwt token
    const token = window.localStorage.getItem("rp_token");
    if (token) {
      //get user from jwt token
      console.log("Found Token , fetching user");
      const user = await api.get(`${apiUrl}/api/twitter/self`);
      console.log(user)
      //change mobx store
      this.props.changeLoginState(true, user, token);
    } else this.props.changeLoginState(false, null, "");
    this.setState({ loading: false });
  };
  render() {
    return this.state.loading ? <Progress /> : <AppRouter />;
  }
}

export default connect(null, { changeLoginState })(App);
