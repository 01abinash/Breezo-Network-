const User = require("../model/User");
const bcrypt = require("bcrypt");
const { id } = require("date-fns/locale");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  console.log("hit");
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email or password missing" });
  // console.log(User, email, password, "========");
  const foundUser = await User.findOne({ email: email }).exec();
  // console.log(foundUser);
  if (!foundUser) {
    console.log("401:", email, "User does not exist");
    return res
      .status(401)
      .json({ error: "Unauthorized: User does not exist." });
  }
  //evaluate password
  // console.log("pass", password, "fUpass:", foundUser.password);
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // create and send JWT
    // console.log("asdf", process.env.ACCESS_TOKEN_SECRET, foundUser.username);
    // console.log(" secret", process.env.ACCESS_TOKEN_SECRET)
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
          wallet_address: foundUser.wallet_address,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5d" }
    );

    // const refreshToken = jwt.sign(
    //   { username: foundUser.username },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "10m" }
    // );
    // foundUser.refreshToken = refreshToken;
    // const result = await foundUser.save();
    // console.log("erase refToken result:", result);

    // res.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    //   sameSite: "None",
    //   secure: true,
    // });
    res.status(200).json({ success: true, token: accessToken });
  } else {
    // console.log("lastres");
    res.sendStatus({ success: false, message: 401 });
  }
};
const handleSignIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email or password missing" });

  const foundUser = await User.findOne({ email: email }).exec();
  if (foundUser) {
    console.log("401:", email, "User already exists");
    return res
      .status(401)
      .json({ error: "Unauthorized: User already exists." });
  }

  const result = await User.create({
    email: email,
    password: bcrypt.hashSync(password, 10),
    roles: ["user"],
  });
  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: result,
  });
};

module.exports = { handleLogin, handleSignIn };
