const router = require("express").Router();
const passport = require("passport");
const { authController } = require("../../controllers");
const { route } = require("./twitter");

// when login is successful, retrieve user info
router.route("/twitter/reverse").post(authController.reverse);

router
  .route("/twitter")
  .post(
    authController.authRequest,
    passport.authenticate("twitter-token", { session: false }),
    authController.getToken
    );

router.route('/logout').delete(authController.logout)
router.route('/enterprise/register').post(authController.register)
router.route('/enterprise/login').post(authController.login)
router.route('/enterprise/:enterpriseId/addagent').post(authController.agentRegister)

module.exports = router;
