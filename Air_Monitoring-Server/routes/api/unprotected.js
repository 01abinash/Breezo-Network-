const {
  getAqiWithMac,
  insertDevice,
} = require("../../controllers/registerController");

const unprotectedRoute = require("express").Router();

unprotectedRoute.route("/insert-device").post(insertDevice);

module.exports = unprotectedRoute;
