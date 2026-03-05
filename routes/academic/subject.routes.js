const express = require("express");
const verifyBranchAdminUserJWT = require("../../middleware/jwtVerification/verifyJWT");
const { createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject } = require("../../controller/academic/subject.controller");
const router = express.Router();

// Subject routes with JWT verification
router.post("/create-subject", verifyBranchAdminUserJWT, createSubject);
router.get("/get-subject-all", verifyBranchAdminUserJWT, getAllSubjects);
router.get("/get-subject/:id", verifyBranchAdminUserJWT, getSubjectById);
router.put("/update-subject/:id", verifyBranchAdminUserJWT, updateSubject);
router.delete("/delete-subject/:id", verifyBranchAdminUserJWT, deleteSubject);

module.exports = router;