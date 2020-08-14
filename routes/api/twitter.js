const router = require("express").Router();
const userAuth = require("../../middleware/authPermissions");
const { twitterController } = require("../../controllers");

router.get("/self", userAuth, twitterController.getUserDetails);

router.get("/tweets/:enterpriseId", userAuth, twitterController.getMentionedTweets);

router.get("/user/tweets/:enterpriseId", userAuth, twitterController.getUserTweets);

router.post("/postReplies/:enterpriseId", userAuth, twitterController.postReplies);

module.exports = router;
