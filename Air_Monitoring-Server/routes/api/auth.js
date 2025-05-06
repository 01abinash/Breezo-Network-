const authRouter = require("express").Router();

const {
  handleLogin,
  handleSignIn,
} = require("../../controllers/authController");

authRouter.route("/login").post(handleLogin);
authRouter.route("/signup").post(handleSignIn);

module.exports = authRouter;
