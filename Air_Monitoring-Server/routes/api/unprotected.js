const {
  getAqiWithMac,
  postLiveAirQuality,
  insertDevice,
} = require("../../controllers/registerController");

const unprotectedRoute = require("express").Router();

unprotectedRoute.route("/insert-device").post(insertDevice);
unprotectedRoute.route("/air").post(postLiveAirQuality);

module.exports = unprotectedRoute;
