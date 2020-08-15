const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const sharedFunctions = require("../lib/sharedFunctions");

module.exports = function (req, res, next) {
  const { accessToken, refreshToken } = req.cookies
  const payload = jwt.verify(accessToken, JWT_SECRET, function (err, decoded) {
    if (err) {
      if (err.message === 'jwt expired') {
        const refreshPayload = jwt.verify(refreshToken, JWT_SECRET, function (err, decoded) {
          if (err) {
            res.cookie('accessToken', { maxAge: 0 })
            res.cookie('refreshToken', { maxAge: 0 })
            res.json({ error: 'Token expired' }).end()
          }
          if (decoded) {
            const newAccessToken = sharedFunctions.accessToken({ email: decoded.email, enterprise: decoded.enterprise });
            res.cookie('accessToken', newAccessToken,
              {
                maxAge: 1000 * 60 * 60 * 24 * 7,
              });
            console.log(newAccessToken)
          }
        })
      }
      else {
        res.cookie('accessToken', '', { maxAge: 0 })
        res.cookie('refreshToken', '', { maxAge: 0 })
        res.json({ error: 'Invalid authentication token' }).end()
      }
    }
  })
  console.log(payload)

  if (!req || !req.headers || !req.headers["x-auth-token"]) {
    return res.status(401).end();
  }
  req.user = jwt.decode(req.headers["x-auth-token"], JWT_SECRET).user;
  return next();


};
