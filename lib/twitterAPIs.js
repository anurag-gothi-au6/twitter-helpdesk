const Twit = require("twit");
const keys = require("../config/keys");

const twitterClient = function (token, secret) {
  const client = new Twit({
    consumer_key: keys.TWITTER_CONSUMER_KEY,
    consumer_secret: keys.TWITTER_CONSUMER_SECRET,
    timeout_ms: 60 * 1000,
    access_token: token,
    access_token_secret: secret
  });
  return {
    getUserDetails() {
      return client.get("/account/verify_credentials", {});
    },
    getTweets(query) {
      console.log(query)
      return client.get("/search/tweets", { q: query });
    },
    streamTweets(query) {
      console.log(query)
      return client.stream("statuses/filter", { track: query });
    },
    mentionedTweets(since_id = 1000000) {
      return client.get("/statuses/mentions_timeline", { since_id: since_id, count: 100 });
    },
    userTimelineTweets(since_id = 1000000) {
      console.log(since_id)
      return client.get("/statuses/user_timeline", { since_id: since_id, count: 100 });
    },
    homeTimelineTweets() {
      return client.get("/statuses/home_timeline");
    },
    postReplies(params) {
      return client.post("/statuses/update", params);
    }
  };
};

module.exports = twitterClient;
