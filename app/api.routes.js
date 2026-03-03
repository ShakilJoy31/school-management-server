
const authenticationRoutes = require("../routes/authentication.routes");

const router = require("express").Router();

router.use("/super-admin", authenticationRoutes);
router.use("/school", authenticationRoutes);



module.exports = router;