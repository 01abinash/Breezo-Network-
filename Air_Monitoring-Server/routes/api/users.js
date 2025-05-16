const router = require("express").Router();
const { verifyJWT } = require("../../middleware/verifyJWT");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

const {
  handleGetAllUsers,
  deleteUser,
  updateUser,
  viewBookedTrips,
  deleteBookedTrips,
  updateBookedTrips,
  getUserDetails,
} = require("../../controllers/userController");

router.route("/users").get(handleGetAllUsers).delete(deleteUser);

router
  .route("/users/updateTrip/:id")
  .put(verifyJWT, verifyRoles(ROLES_LIST.Passenger), updateBookedTrips);

router.put("/users/:id", updateUser);

router
  .route("/users/profile")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Passenger), getUserDetails);
module.exports = router;
