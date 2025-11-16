const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const { createSuperAdmin, loginSuperAdmin, changePassword, updateProfile, deleteSuperAdmin } = require("../controller/auth/superadmin");

// Public
router.post("/create-superadmin", createSuperAdmin);
router.post("/login-superadmin", loginSuperAdmin);

// Protected (requires JWT)
router.put("/change-password", verifyJWT, changePassword);
router.put("/update-profile", verifyJWT, updateProfile);
router.delete("/delete-superadmin/:id", verifyJWT, deleteSuperAdmin);

module.exports = router;
