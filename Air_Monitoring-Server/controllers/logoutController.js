const User = require("../model/User");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  //On client delete access token
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //Successful but No content

  //   Is refreshtoken in db
  const refreshToken = cookies.jwt;

  const foundUser = Users.findOne({ refreshToken }).exec();
  if (!foundUser) {
    console.log("did not find mathc for ", user, "and ");
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  //Deleting refresh token from database.
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log("result", result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // secure: true
  res.sendStatus(204);
};

module.exports = { handleLogout };
