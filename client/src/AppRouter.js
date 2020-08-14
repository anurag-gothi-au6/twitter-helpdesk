import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import LoginPage from "./layouts/Login/Try";
import TwitterLogin from './layouts/Login/LoginPage'
import DashBoard from "./layouts/DashBoard/DashBoard";
import { connect } from "react-redux";

const AppRouter = (props) => {
  return (
    <Router>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Switch>
          {!props.isLoggedIn && <Redirect from="/dashboard" to="/" exact />}
          {props.isLoggedIn && <Redirect from="/" to="/dashboard" exact />}
          <Route exact path="/dashboard" component={DashBoard} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/" component={TwitterLogin} />
        </Switch>
      </div>
    </Router>
  );
};

const mapStateToProps = (storeState)=>{
  return{
    isLoggedIn:storeState.userState.isLoggedIn
  }
}

export default connect(mapStateToProps)(AppRouter);
