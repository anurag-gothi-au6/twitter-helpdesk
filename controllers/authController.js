const request = require("request");
const keys = require("../config/keys");
const sharedFunctions = require("../lib/sharedFunctions");
const User = require("../models/Users");
const Enterprise = require("../models/Enterprise")
const { use } = require("passport");
const Mailer = require("../lib/mailer")
var generator = require('generate-password');


const CLIENT_HOME_PAGE_URL =
  keys.ENV === "production"
    ? "https://twitter-hd-anurag.herokuapp.com"
    : "http://127.0.0.1:3000";

module.exports = {
  register: async (req, res) => {
    try {
      const { enterpriseName, name, email, password } = req.body;
      const checkUser = await User.findOne({ email: email })
      const checkEnterprise = await Enterprise.findOne({ enterpriseName: enterpriseName })
      if (checkUser) {
        throw new Error('Email Already Exists');
      }
      if (checkEnterprise) {
        throw new Error('Enterprise Name Already Exists')
      }
      const enterprise = await Enterprise.create({ enterpriseName: enterpriseName })
      console.log('password', password)
      const newUser = await User.create({ name: name, email: email, password: password, enterprise: enterprise._id, isAdmin: true })
      const accessToken = sharedFunctions.accessToken({ email: newUser.email, enterprise: newUser.enterprise });
      const refreshToken = sharedFunctions.refreshToken({ email: newUser.email, enterprise: newUser.enterprise, isAdmin: newUser.isAdmin })
      res.cookie('accessToken', accessToken,
        {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      res.cookie('refreshToken', refreshToken,
        {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      res.status(200).json({ user: newUser })
    }
    catch (err) {
      res.json({ error: err.message })
    }
  },
  login: async (req, res) => {
    try {
      console.log(req.body)
      const user = await User.findByEmailAndPassword(req.body.email, req.body.password)
      console.log(user)
      const accessToken = sharedFunctions.accessToken({ email: user.email, enterprise: user.enterprise });
      const refreshToken = sharedFunctions.refreshToken({ email: user.email, enterprise: user.enterprise, isAdmin: user.isAdmin })
      res.cookie('accessToken', accessToken,
        {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      res.cookie('refreshToken', refreshToken,
        {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      const userTobeSent = await User.findOne({ _id: user._id })
      if (user) {
        if (user.enterprise.accessToken === null) {
          if (user.admin === true) {
            res.status(200).json({ user: userTobeSent })
          }
          else {
            res.status(200).json({ user: userTobeSent })
          }
        }
        else if (user.enterprise.accessToken) {

          res.setHeader("x-auth-token", user.enterprise.accessToken);

          res.status(200).json({ user: userTobeSent })
        }
        else {
          res.status(200).json({ user: userTobeSent })
        }
      }
      else {
        throw new Error('User not Found')
      }
    } catch (error) {
      console.log(error)
      res.json({ error: error.message })
    }
  },

  agentRegister: async (req, res) => {
    try {
      const { email, name } = req.body
      const enterpriseId = req.params.enterpriseId

      const checkUser = await User.findOne({ email: email })
      if (checkUser) {
        res.status(200).json({ error: 'User already exists' })
      }
      const checkEnterprise = await Enterprise.findOne({ _id: enterpriseId })
      const password = generator.generate({
        length: 10,
        numbers: true
      });
      const newUser = await User.create({ name: name, email: email, password: password, enterprise: checkEnterprise._id, isAdmin: false })
      Mailer(name, email, password, checkEnterprise.enterpriseName)
      res.json({ status: 'user created' })
    } catch (error) {
      console.log(error)
      res.json({ error: error })
    }

  },
  getToken: async (req, res, next) => {
    try {
      console.log('here')
      const payload = {
        ...req.body
      };
      console.log(payload)
      req.token = sharedFunctions.createToken({ oauth_token: payload.oauth_token, oauth_verifier: payload.oauth_verifier, oauth_token_secret: payload.oauth_token_secret, user_id: payload.user_id });
      console.log(payload.helpdeskUser.enterprise)
      const enterprise = await Enterprise.findOne({ _id: payload.helpdeskUser.enterprise })
      console.log(enterprise)
      enterprise.accessToken = req.token;
      enterprise.save()
      res.setHeader("x-auth-token", req.token);
      return res.status(200).send();
    } catch (error) {
      console.log("error", error);
      return next(error);
    }
  },

  authRequest: async (req, res, next) => {
    console.log('authRequest')
    request.post(
      {
        url: "https://api.twitter.com/oauth/access_token",
        oauth: {
          consumer_key: keys.TWITTER_CONSUMER_KEY,
          consumer_secret: keys.TWITTER_CONSUMER_SECRET,
          oauth_token: req.body.oauth_token
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
          oauth_verifier: req.body.oauth_verifier,
          oauth_token: req.body.oauth_token
        }
      },
      (err, r, body) => {
        try {
          console.log('auth request', req.body)
          if (err) {
            return res.send(500, { message: err.message });
          }
          console.log(body)
          if (body === 'This feature is temporarily unavailable') {
            res.json({ message: 'Try again later' })
          }
          const parsedBody = sharedFunctions.makeJson(body);
          req.body.oauth_token = parsedBody.oauth_token;
          req.body.oauth_token_secret = parsedBody.oauth_token_secret;
          req.body.user_id = parsedBody.user_id;
          next();
          return true;
        } catch (error) {
          return next(error);
        }
      }
    );
  },

  reverse: async (req, res, next) => {
    request.post(
      {
        url: "https://api.twitter.com/oauth/request_token",
        oauth: {
          consumer_key: keys.TWITTER_CONSUMER_KEY,
          consumer_secret: keys.TWITTER_CONSUMER_SECRET
        },
        form: {
          oauth_callback: CLIENT_HOME_PAGE_URL
        }
      },
      (err, r, body) => {
        try {
          console.log(err, body)
          if (err) {
            console.log('errorData')
            return res.send(500, { message: err.message });
          } else {
            const jsonBody = sharedFunctions.makeJson(body);
            return res.send(jsonBody);
          }
        } catch (error) {
          console.log("error at twitter reverse controller - ", error);
          return next(error);
        }
      }
    );
  },
  logout: async (req, res) => {
    res.cookie('accessToken','' ,{ maxAge: 0 })
    res.cookie('refreshToken','' ,{ maxAge: 0 })
    res.json({ response: 'loggedOut' })
  }
};
