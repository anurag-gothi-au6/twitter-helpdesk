const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

module.exports = {
  makeJson: data =>
    JSON.parse(
      '{"' +
      data
        .split("=")
        .join('":"')
        .split("&")
        .join('","') +
      '"}'
    ),

  createToken: payload =>
    jwt.sign({ user: payload }, JWT_SECRET, { expiresIn: "365 days" }),
  accessToken: payload =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" }),
  refreshToken: payload =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7 days" })


};
