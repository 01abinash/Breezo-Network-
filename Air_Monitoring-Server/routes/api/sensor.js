const {
  getAverageFromCityDistrict,
  echoIot,
  getUniqueDistrictInformation,
} = require("../../controllers/registerController");
const sensorRoutes = require("express").Router();

sensorRoutes.route("/IOT").post(echoIot);

sensorRoutes.route("/unique-districts").get(getUniqueDistrictInformation);

sensorRoutes
  .route("/averageOfDistrict/:city_district")
  .get(getAverageFromCityDistrict);

module.exports = sensorRoutes;
