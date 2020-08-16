import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import api from "../../shared/customAxios";
import { apiUrl } from "../../shared/vars";
import { Grid, Paper, Divider } from "@material-ui/core";
import { connect } from "react-redux";
import Header from "../../components/Header/Header";
import { withRouter } from "react-router-dom";
import ReplyBox from "../../components/ReplyBox/ReplyBox";
import TweetList from "../../components/Tweets/TweetList";
import ChatList from "../../components/Chats/ChatList";
import InfoColumn from "../../components/Information/InfoColumn";
import { updateUser, changeLoginState } from "../../redux/actions/userActions";
import axios from "axios";
class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: {},
      tweets: [],
      userTweets: [],
      selectedTweet: null,
      selectedIndex: null,
      replies: {},
      replyButtonDisabled: false,
      reply: "",
    };
  }

  getTweets = async () => {
    return await api.get(
      `${apiUrl}/api/twitter/tweets/${this.props.helpdeskUser.enterprise}`
    );
  };

  getUserReplies = async () => {
    return await api.get(
      `${apiUrl}/api/twitter/user/tweets/${this.props.helpdeskUser.enterprise}`
    );
  };

  componentDidMount() {
    console.log("in dashboard");
    this.setState({ isLoading: true });
    this.init();
  }

  init = async () => {
    console.log("in dashboard", this.props.user);
    const user = this.props.user
      ? this.props.user
      : await api.get(`${apiUrl}/api/twitter/self`);
    console.log(user);
    this.props.updateUser(user);
    const { data: allTweets } = await this.getTweets();
    console.log(allTweets);
    const [pass, fail] = allTweets.reduce(
      ([p, f], e) =>
        e.in_reply_to_status_id === null ? [[...p, e], f] : [p, [...f, e]],
      [[], []]
    );
    let replies = {};
    pass.forEach((e) => (replies[e.id] = []));

    const userReplies = await this.getUserReplies();

    replies = await this.createTweetsThread(fail, userReplies, replies);

    console.log("replies ", replies);

    this.setState(
      {
        isLoading: false,
        user,
        tweets: pass,
        replies,
      },
      () => this.initSockets()
    );
  };

  initSockets = async () => {
    const { user } = this.state;
    const socket = socketIOClient(apiUrl);
    socket.on("connect", async () => {
      console.log("Socket Connected! , Emitting screen Name", user.screen_name);
      socket.emit("register_screen_name", {
        term: user.screen_name,
        jwtToken: this.props.jwtToken,
      });
      socket.on("tweets", (tweet) => {
        if (tweet.in_reply_to_status_id !== null) {
          this.handleIncomingReply(tweet);
        } else if (!this.state.tweets.some((o) => o.id === tweet.id))
          this.setState({ tweets: [tweet].concat(this.state.tweets) });
      });
    });
    socket.on("disconnect", () => {
      socket.off("tweets");
      socket.removeAllListeners("tweets");
    });
  };

  createTweetsThread = async (tweets, userReplies, replies) => {
    let combined = [...tweets, ...userReplies].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    for (let tweet of combined) {
      if (replies[tweet.in_reply_to_status_id])
        replies[tweet.in_reply_to_status_id].push(tweet);
      else {
        for (const replyArrId of Object.keys(replies)) {
          if (
            replies[replyArrId].some(
              (reply) => reply.id === tweet.in_reply_to_status_id
            )
          ) {
            replies[replyArrId].push(tweet);
            break;
          }
        }
      }
    }
    return replies;
  };

  handleIncomingReply = (tweet) => {
    let { replies } = this.state;
    if (replies[tweet.in_reply_to_status_id])
      replies[tweet.in_reply_to_status_id].push(tweet);
    else {
      for (const replyArrId of Object.keys(replies)) {
        if (
          replies[replyArrId].some(
            (reply) => reply.id === tweet.in_reply_to_status_id
          )
        ) {
          if (replies[replyArrId].some((reply) => reply.id === tweet.id))
            return;
          replies[replyArrId].push(tweet);
          break;
        }
      }
    }
    this.setState({ replies });
  };

  handleSelected = (index, tweet) => {
    this.setState({
      selectedIndex: index,
      selectedTweet: tweet,
    });
  };

  handleReply = (str) => {
    this.setState({
      reply: str,
    });
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  postReplies = async (query) => {
    if (this.state.selectedTweet === null) {
      window.alert("Please select a tweet to reply");
      return;
    }
    this.setState({ replyButtonDisabled: true });
    const { data } = await api.post(
      `${apiUrl}/api/twitter/postReplies/${this.props.helpdeskUser.enterprise}`,
      JSON.stringify({
        inReplyToStatusId: query.selectedTweet.id_str,
        replier: this.props.helpdeskUser._id,
        status: query.reply,
      })
    );
    const replies = { ...query.replies };

    if (!replies[query.selectedTweet.id]) {
      replies[query.selectedTweet.id] = [];
    }
    replies[query.selectedTweet.id].push(data);

    this.setState({
      reply: "@" + query.selectedTweet.user.screen_name + " ",
      replies,
      replyButtonDisabled: false,
    });
  };

  logout = async () => {
    window.localStorage.clear();
    this.props.changeLoginState(false, null, "");
    await axios.delete(`${apiUrl}/api/auth/logout`)
    setTimeout(() => {
      this.props.history.push("/login");
    }, 100);
  };

  render() {
    const {
      replies,
      selectedIndex,
      selectedTweet,
      reply,
      tweets,
      isLoading,
      replyButtonDisabled,
    } = this.state;
    return (
      <div
        style={{
          width: "90%",
          margin:'auto',
          height:"100%"
        }}
      >
        <Header
          logout={this.logout}
          enterprise={this.props.helpdeskUser.enterprise}
          Name={this.props.helpdeskUser.name}
          Admin={this.props.helpdeskUser.isAdmin}
        />

        <Grid container spacing={0} height='100%'>
          <Grid item xs={3}>
            <TweetList
              isLoading={isLoading}
              tweets={tweets}
              selectedIndex={selectedIndex}
              handleReply={this.handleReply}
              handleSelected={this.handleSelected}
            ></TweetList>
          </Grid>

          <Grid item xs={6}>
            <Paper
              style={{
                height: "81vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                boxShadow:0,
                border:'1px solid #B0B0B0',
                borderRadius:'10px'
              }}
              boxShadow={0}
            >
              
              <Grid item xs={12}>
              {selectedTweet ? (
                <div className='chatHeader'>
                  <img src={selectedTweet.user.profile_image_url} className='chatImage' alt="user profile"></img>
              <p>{selectedTweet.user.name}</p>
                </div>
              ) : (
                ""
              )}
              <Divider />
                <ChatList
                  isLoading={isLoading}
                  selectedTweet={selectedTweet}
                  replies={replies}
                ></ChatList>
                {selectedTweet?
                <ReplyBox
                  reply={reply}
                  replyButtonDisabled={replyButtonDisabled}
                  handleInputChange={this.handleInputChange}
                  postReplies={() => {
                    this.postReplies({ reply, selectedTweet, replies });
                  }}
                ></ReplyBox>:''}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <InfoColumn selectedTweet={selectedTweet} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (storeState) => {
  return {
    isLoggedIn: storeState.userState.isLoggedIn,
    jwtToken: storeState.userState.jwt,
    user: storeState.userState.user,
    helpdeskUser: storeState.userState.helpdeskUser,
  };
};

export default connect(mapStateToProps, { updateUser, changeLoginState })(
  withRouter(DashBoard)
);
