// const Admin_email = process.env.ADMIN_EMAIL
// const Admin_pwd = process.env.ADMIN_PWD
const UpcommingTrips = require("../model/UpcommingTrips");
const BusModel = require("../model/Bus");
const UserModel = require("../model/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  console.log("hit admin");
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email or password missing" });
  const Admin_email = process.env.ADMIN_EMAIL;
  const Admin_pwd = process.env.ADMIN_PWD;
  // Compare hashed password using bcrypt.compare
  const passwordMatch = bcrypt.compare(password, Admin_pwd);

  if (email === Admin_email && passwordMatch) {
    const Roles = { Admin: 5150 };
    const accessToken = jwt.sign(
      {
        UserInfo: {
          roles: Roles,
          email: email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5d" }
    );
    res.status(200).json({ token: accessToken });
  } else {
    // console.log("lastres");
    res.sendStatus(401);
  }
};
module.exports = { adminLogin, getAllData };
// adminDeleteUser
