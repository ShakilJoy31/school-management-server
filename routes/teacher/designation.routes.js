const express = require("express");
const verifyBranchAdminUserJWT = require("../../middleware/jwtVerification/verifyJWT");
const { createDesignation, getAllDesignations, getDesignationById, updateDesignation, deleteDesignation } = require("../../controller/teacher/designation.controller");

const router = express.Router();

// Designation routes with JWT verification
router.post("/create-designation", verifyBranchAdminUserJWT, createDesignation);
router.get("/get-designation-all", verifyBranchAdminUserJWT, getAllDesignations);
router.get("/get-designation-by-id/:id", verifyBranchAdminUserJWT, getDesignationById);
router.put("/update-designation/:id", verifyBranchAdminUserJWT, updateDesignation);
router.delete("/delete-designation/:id", verifyBranchAdminUserJWT, deleteDesignation);

module.exports = router;