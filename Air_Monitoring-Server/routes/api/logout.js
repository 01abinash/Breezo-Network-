const { handleLogout } = require("../../controllers/logoutController");

const router = require("express").Router();

router.route("/logout").get(handleLogout);

module.exports = router;
