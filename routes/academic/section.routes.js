const express = require("express");
const { 
  createSection, 
  getAllSections, 
  getSectionById, 
  updateSection, 
  deleteSection,
} = require("../../controller/academic/section.controller");
const verifyBranchAdminUserJWT = require("../../middleware/jwtVerification/verifyJWT");
const router = express.Router();

// Section routes with JWT verification
router.post("/create-section", verifyBranchAdminUserJWT, createSection);
router.get("/get-section-all", verifyBranchAdminUserJWT, getAllSections);
router.get("/get-section/:id", verifyBranchAdminUserJWT, getSectionById);
router.put("/update-section/:id", verifyBranchAdminUserJWT, updateSection);
router.delete("/delete-section/:id", verifyBranchAdminUserJWT, deleteSection);

module.exports = router;