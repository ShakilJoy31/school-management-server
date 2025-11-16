
const authenticationRoutes = require("../routes/authentication.routes");

const router = require("express").Router();

router.use("/authentication", authenticationRoutes);

module.exports = router;