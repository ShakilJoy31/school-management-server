const express = require("express");
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require("../../controller/academic/class.controller");
const verifyBranchAdminUserJWT = require("../../middleware/jwtVerification/verifyJWT");
const router = express.Router();


// Protected routes - with JWT verification
router.post("/create-class",verifyBranchAdminUserJWT, createClass);
router.get("/get-class-all",verifyBranchAdminUserJWT, getAllClasses);
router.get("/get-class/:id",verifyBranchAdminUserJWT, getClassById);
router.put("/update-class/:id",verifyBranchAdminUserJWT, updateClass);
router.delete("/delete-class/:id",verifyBranchAdminUserJWT, deleteClass);

module.exports = router;