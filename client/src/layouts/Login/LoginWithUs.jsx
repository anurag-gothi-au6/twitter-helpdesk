import React, { useState, useEffect } from "react";
import { Button, Typography, Paper, Input } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import api from "../../shared/customAxios";
import { apiUrl } from "../../shared/vars";
import { connect } from "react-redux";
import { helpdeskUser, changeLoginState } from "../../redux/actions/userActions";
import { isMobile } from "react-device-detect";
import axios from "axios";

function LoginPage(props) {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingLogin, setLoadingLogin] = useState(true);

  const login = async (email,password) => {
    try {
      setLoading(true);
      console.log(email,password)
      const res = await axios.post(`${apiUrl}/api/auth/enterprise/login`, {
        email: email,
        password: password,
      });
      console.log(res)
      if (!res.headers["x-auth-token"]) {
        window.alert("Ask your enterprise admin to add twitter account");
        props.changeLoginState(false, null, "");
        return;
      } 
      else if(res.headers['x-auth-token']) {
        props.helpdeskUser(res.data.user);
        props.changeLoginState(true, null, res.headers["x-auth-token"]);
        props.history.push("/dashboard");
        return
        console.log(props.history);
      }
      else if (res.data) {
        props.helpdeskUser(res.data.user);
        props.history.push("/");
      }
    } catch (error) {
      console.log(error.message);
      window.alert('invalid credentials')
    }
  };
  function useInput({ type, placeholder }) {
    const [value, setValue] = useState("");
    const input = (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        placeholder={placeholder}
        required
      />
    );
    return [value, input];
  }

  const [enterpriseName, enterpriseNameInput] = useInput({
    type: "text",
    placeholder: "Enterpise Name",
  });
  const [name, nameInput] = useInput({
    type: "text",
    placeholder: "user Name",
  });
  const [email, emailInput] = useInput({ type: "email", placeholder: "Email" });
  const [password, passwordInput] = useInput({
    type: "password",
    placeholder: "Password",
  });
  const [confirmpassword, confirmpasswordInput] = useInput({
    type: "password",
    placeholder: "Confirm password",
  });

  const [loginemail, loginemailInput] = useInput({
    type: "email",
    placeholder: "Email",
  });
  const [loginpassword, loginpasswordInput] = useInput({
    type: "password",
    placeholder: "Password",
  });
  const verify = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/api/auth/enterprise/register`, {
        name: name,
        email: email,
        password: email,
        enterpriseName: enterpriseName,
      });
      if (res.data) {
        props.helpdeskUser(res.data.user);
        props.history.push("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (
      name.length > 3 &&
      enterpriseName.length > 3 &&
      /.+@.+\.[A-Za-z]+$/.test(email) &&
      password === confirmpassword &&
      password.length > 6
    ) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [name, email, password, confirmpassword, enterpriseName]);

  useEffect(() => {
    if (/.+@.+\.[A-Za-z]+$/.test(loginemail) && loginpassword.length > 6) {
      setLoadingLogin(false);
    } else {
      setLoadingLogin(true);
    }
  }, [loginemail, loginpassword]);
  useEffect(() => {
    var search = window.location.search.substring(1);
    if (search) {
      const query = JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
      console.log(query);
      console.log(typeof query);
      console.log(name);
      if (query && Object.keys(query).length > 0) {
        verify(query, props, name, email, password);
      }
    }
  });

  return (
    <div
      style={{
        width: "100%",
        height: isMobile ? "" : "100%",
        position: "absolute",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "#F7F7F7",
      }}
    >
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "25px",
        }}
      >
        <form>
          <Typography variant="h3" style={{ color: "#4a4b54" }} gutterBottom>
            Twitter Deck
            <br />
            {enterpriseNameInput}
            <br />
            {nameInput}
            <br />
            {emailInput}
            <br />
            {passwordInput}
            <br />
            {confirmpasswordInput}
          </Typography>
          <Button
            disabled={isLoading}
            variant="contained"
            size="large"
            color="primary"
            aria-label="add"
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onClick={() => {
              setLoading(true);
              verify(name, email, password, enterpriseName);
            }}
          >
            Register
          </Button>
        </form>
      </Paper>
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "25px",
          height: "24rem",
        }}
      >
        <form style={{ marginTop: "5rem" }}>
          <Typography variant="h3" style={{ color: "#4a4b54" }} gutterBottom>
            Twitter Deck
            <br />
            {loginemailInput}
            <br />
            {loginpasswordInput}
          </Typography>
          <Button
            disabled={isLoadingLogin}
            variant="contained"
            size="large"
            color="primary"
            aria-label="add"
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onClick={() => {
              setLoading(true);
              login(loginemail,loginpassword);
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default connect(null, { changeLoginState,helpdeskUser })(withRouter(LoginPage));
