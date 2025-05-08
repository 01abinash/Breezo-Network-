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
} = require("../../controllers/registerController");
const Air = require("../../model/Air");
const registerRouter = require("express").Router();

// registerRouter.route("/air").post(postLiveAirQuality);
registerRouter.route("/air").post(async (req, res) => {
  console.log("reqreq", req.body);
  const {
    pm25,
    mac_address,
    pm10,
    temperature,
    time,
    humidity,
    co2_ppm,
    aqi_status,
  } = req.body;

  // console.log("res.json", res.body);

  const result = await Air.create({
    pm25,
    pm10,
    mac_address,
    temperature,
    time,
    humidity,
    co2_ppm,
    aqi_status,
    utc: new Date(),
  });

  console.log("db res", result);

  return res.json({ success: true, message: "hit", data: req.body });
});

// registerRouter.route("/air").get(getAllAirData);
registerRouter.route("/update-user-devices/:userId").put(putDevicesInUsers);
registerRouter.route("/user/:userId").get(getUserData);
registerRouter.route("/IOT").post(echoIot);

registerRouter.route("/unique-districts").get(getUniqueDistrictInformation);

registerRouter
  .route("/averageOfDistrict/:city_district")
  .get(getAverageFromCityDistrict);

module.exports = registerRouter;
