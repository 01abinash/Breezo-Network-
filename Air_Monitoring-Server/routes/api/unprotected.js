const {
  getAqiWithMac,
  postLiveAirQuality,
  insertDevice,
} = require("../../controllers/registerController");

const unprotectedRoute = require("express").Router();

unprotectedRoute.route("/insert-device").post(insertDevice);
unprotectedRoute.route("/air").post(postLiveAirQuality);
unprotectedRoute.route("/air/:mac_address").get(getAqiWithMac);

module.exports = unprotectedRoute;
