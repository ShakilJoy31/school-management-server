const express = require("express");
const verifyBranchAdminUserJWT = require("../../middleware/jwtVerification/verifyJWT");
const { createGroupSubject, getAllGroupSubjects, getGroupSubjectById, updateGroupSubject, deleteGroupSubject } = require("../../controller/academic/groupSubject.controller");
const router = express.Router();

// Group Subject routes with JWT verification
router.post("/create-group-subject", verifyBranchAdminUserJWT, createGroupSubject);
router.get("/get-group-subject-all", verifyBranchAdminUserJWT, getAllGroupSubjects);
router.get("/get-group-subject-by-id/:id", verifyBranchAdminUserJWT, getGroupSubjectById);
router.put("/update-group-subject/:id", verifyBranchAdminUserJWT, updateGroupSubject);
router.delete("/delete-group-subject/:id", verifyBranchAdminUserJWT, deleteGroupSubject);

module.exports = router;