
const authenticationRoutes = require("../routes/authentication.routes");

const router = require("express").Router();

router.use("/user-creation", authenticationRoutes);




module.exports = router;