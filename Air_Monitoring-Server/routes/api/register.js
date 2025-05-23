const {
  handleNewUser,
  handleNewCompany,
  getAverageFromCityDistrict,
  postLiveAirQuality,
  getAllAirData,
  echoIot,
  getUserData,
  getUniqueDistrictInformation,
  putDevicesInUsers,
  getAqiWithMac,
  getDevicesOfUser,
  getEarningStatistics,
} = require("../../controllers/registerController");
const { transferToken } = require("../../controllers/tokenHandler");

const Air = require("../../model/Air");
const registerRouter = require("express").Router();

// registerRouter.route("/air").post(postLiveAirQuality);
// registerRouter.route("/air/:mac_address").get(getAqiWithMac);

// registerRouter.route("/air").get(getAllAirData);
// registerRouter.route("/update-user-devices/:userId").put(putDevicesInUsers);

registerRouter.route("/user/devices").get(getDevicesOfUser);
registerRouter.route("/user/:userId").get(getUserData);

registerRouter.route("/IOT").post(echoIot);

registerRouter.route("/assign-sensor-to-user").post(putDevicesInUsers);
registerRouter.route("/assign-sensor-to-user").post(putDevicesInUsers);
registerRouter.route("/token-convert").post(transferToken);
registerRouter.route("/earning-statistics").get(getEarningStatistics);

registerRouter.route("/unique-districts").get(getUniqueDistrictInformation);

registerRouter
  .route("/averageOfDistrict/:city_district")
  .get(getAverageFromCityDistrict);

module.exports = registerRouter;
