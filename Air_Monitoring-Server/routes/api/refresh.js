const refreshRouter = require("express").Router();
const {
  handleRefreshToken,
} = require("../../controllers/refreshTokenController");
refreshRouter.route("/refresh").get(handleRefreshToken);

module.exports = refreshRouter;
