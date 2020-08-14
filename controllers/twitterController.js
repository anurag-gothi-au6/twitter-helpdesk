const twitter = require("../lib/twitterAPIs");
const MentionedTweets = require("../models/MentionedTweets");
const UserReply = require("../models/Replies");
module.exports = {
  getUserDetails: async function (req, res, next) {
    const { user } = req;
    const { data } = await twitter(
      user.oauth_token,
      user.oauth_token_secret
    ).getUserDetails();
    const { name, location, description, screen_name, followers_count } = data;
    let userInfo = {
      name,
      location,
      description,
      screen_name,
      followers_count
    };
    return res.json(userInfo);
  },

  getUserTweets: async function (req, res, next) {
    try {
      const { user } = req;
      const cachedTweet = await UserReply.find({ enterprise: req.params.enterpriseId }).populate('replier')
      console.log(cachedTweet)
      if (cachedTweet.length > 0) {
        var { data } = await twitter(
          user.oauth_token,
          user.oauth_token_secret
        ).userTimelineTweets(cachedTweet[0].id);
      }
      else {
        var { data } = await twitter(
          user.oauth_token,
          user.oauth_token_secret
        ).userTimelineTweets();
      }

      const userTweets = data.filter(
        tweet => tweet.in_reply_to_status_id !== null
      );
      const newData = []
      userTweets.forEach(e => {
        newData.push({
          id: e.id,
          id_str: e.id_str,
          in_reply_to_status_id: e.in_reply_to_status_id,
          created_at: e.created_at,
          text: e.text,
          user: {
            screen_name: e.user.screen_name,
            name: e.user.name,
            profile_image_url: e.user.profile_image_url,
            location: e.user.location,
            description: e.user.description,
            followers_count: e.user.followers_count,
          },
          enterprise: req.params.enterpriseId
        })
      })
      const newDataId= []
      newData.forEach(e=>{
        newDataId.push(e.id)
      })
      const duplicates = await UserReply.find({id:{$in:newDataId} })
      const dupId = []
      duplicates.forEach(e=>{
        dupId.push(e.id)
      })
      const dataForDb = newData.filter(f => !dupId.includes(String(f.id)));
      const newDbData = await UserReply.insertMany(dataForDb)
      const latestTweet = await UserReply.find({ enterprise: req.params.enterpriseId }).populate('replier')
      return res.json(latestTweet);
    } catch (err) {
      console.log("ERROR at USER TWEETS ", err);
      next();
    }
  },

  getMentionedTweets: async function (req, res, next) {
    try {
      const { user } = req;
      const cachedTweet = await MentionedTweets.find({ enterprise: req.params.enterpriseId })
      if (cachedTweet.length > 0) {
        var { data } = await twitter(
          user.oauth_token,
          user.oauth_token_secret
        ).mentionedTweets(cachedTweet[0].id);
      }
      else {
        var { data } = await twitter(
          user.oauth_token,
          user.oauth_token_secret
        ).mentionedTweets();
      }

      const newData = []
      data.forEach(e => {
        newData.push({
          id: e.id,
          id_str: e.id_str,
          in_reply_to_status_id: e.in_reply_to_status_id,
          created_at: e.created_at,
          text: e.text,
          user: {
            screen_name: e.user.screen_name,
            name: e.user.name,
            profile_image_url: e.user.profile_image_url,
            location: e.user.location,
            description: e.user.description,
            followers_count: e.user.followers_count,
          },
          enterprise: req.params.enterpriseId
        })
      })
      const newDataId= []
      newData.forEach(e=>{
        newDataId.push(e.id)
      })
      const duplicates = await MentionedTweets.find({id:{$in:newDataId} })
      const dupId = []
      duplicates.forEach(e=>{
        dupId.push(e.id)
      })
      const dataForDb = newData.filter(f => !dupId.includes(String(f.id)));
      const newDbData = await MentionedTweets.insertMany(dataForDb)
      const latestTweet = await MentionedTweets.find({ enterprise: req.params.enterpriseId })

      return res.json({ data: latestTweet });
    } catch (err) {
      console.log("ERROR AT GET_TWEETS - ", err);
      next();
    }
  },

  postReplies: async function (req, res, next) {
    try {
      const { user } = req;
      const { status, inReplyToStatusId,replier } = req.body;
      const { data } = await twitter(
        user.oauth_token,
        user.oauth_token_secret
      ).postReplies({ in_reply_to_status_id: inReplyToStatusId, status });
      const e = data
      const dbData = await UserReply.create({
        id: e.id,
        id_str: e.id_str,
        in_reply_to_status_id: e.in_reply_to_status_id,
        created_at: e.created_at,
        text: e.text,
        user: {
          screen_name: e.user.screen_name,
          name: e.user.name,
          profile_image_url: e.user.profile_image_url,
          location: e.user.location,
          description: e.user.description,
          followers_count: e.user.followers_count,
        },
        replier: replier,
        enterprise: req.params.enterpriseId
      })
      const dbDatatoSend = await UserReply.findOne({_id:dbData._id}).populate('replier')
      console.log(dbDatatoSend)
      return res.status(201).json(dbDatatoSend);
    } catch (err) {
      console.log("ERROR AT POST REPLY - ", err);
      next();
    }
  }
};
