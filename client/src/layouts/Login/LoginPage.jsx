import React, { useState, useEffect } from "react";
import { Button, Typography, Paper } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import api from "../../shared/customAxios";
import { apiUrl } from "../../shared/vars";
import { connect } from "react-redux";
import Icon from "@mdi/react";
import { mdiTwitter } from "@mdi/js";
import { changeLoginState } from "../../redux/actions/userActions";
import '../../styles/login.css'


function LoginPage(props) {

  const [isLoading, setLoading] = useState(false);

  const login = async () => {
    const res = await api.post(`${apiUrl}/api/auth/twitter/reverse`);
    console.log(res);
    console.log(res.data.oauth_token);
    if (res.data && res.data.oauth_token) {
      window.location.href =
        `https://api.twitter.com/oauth/authenticate?oauth_token=${res.data.oauth_token}`;
    } else {
      window.alert("ERROR : " + res.message);
    }
  };
  const verify = async (query, props) => {
    setLoading(true);
    console.log(props.helpdeskUser)
    const res = await api.post(
      `${apiUrl}/api/auth/twitter`,
      JSON.stringify({ ...query,helpdeskUser:props.helpdeskUser})
    );
    console.log(res);
    if (!res.headers["x-auth-token"]) {
      props.changeLoginState(false, null, "");
      return;
    } else {
      console.log("redirect");
      props.changeLoginState(true, null, res.headers["x-auth-token"]);
      props.history.push("/dashboard");
      console.log(props.history);
    }
  };



  useEffect(() => {
    console.log(props)
    if(!props.helpdeskUser){
      props.history.push('/login')
    }
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
      console.log(query)
      console.log(typeof(query))
      if (query && Object.keys(query).length > 0) {
        verify(query, props);
      }
    }
  });


  return ( 
  <section
      style={{
        width: "100%",
        height:"100%",
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F7F7",
      }}
      id="entry-page"
    >
      <form>
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "25px",
        }}
      >
          <Typography variant="h3" style={{ color: "#4a4b54" }} gutterBottom>
            {props.helpdeskUser ? props.helpdeskUser.isAdmin ? 'Twitter Deck' :'Ask Your Enterprise Admin to add twitter account':''}
          </Typography>
          <Button
            disabled={isLoading}
            variant="contained"
            size="large"
            color="primary"
            aria-label="add"
            style={{ marginTop: "20px", marginBottom: "20px", backgroundColor:'blue' }}
            startIcon={<Icon path={mdiTwitter} color="white" size={1} />}
            onClick={() => {
              setLoading(true);
              login();
            }}
          >
            Login with Twitter
          </Button>
      </Paper>
      </form>
    </section>
  );
}


const mapStateToProps = (storeState)=>{
  return{
    isLoggedIn:storeState.userState.isLoggedIn,
    jwtToken:storeState.userState.jwt,
    user:storeState.userState.user,
    helpdeskUser:storeState.userState.helpdeskUser
  }
}

export default connect(mapStateToProps, { changeLoginState })(withRouter(LoginPage));
