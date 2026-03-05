const express = require("express");
const { createSession, getAllSessions, getSessionById, updateSession, deleteSession } = require("../../controller/academic/session.controller");
const verifyBranchAdminUserJWT = require("../../middleware/jwtVerification/verifyJWT");
const router = express.Router();


// Session routes with JWT verification
router.post("/create-session", verifyBranchAdminUserJWT, createSession);
router.get("/get-session-all",verifyBranchAdminUserJWT, getAllSessions);
router.get("/get-session/:id",verifyBranchAdminUserJWT, getSessionById);
router.put("/update-session/:id",verifyBranchAdminUserJWT, updateSession);
router.delete("/delete-session/:id",verifyBranchAdminUserJWT, deleteSession);

module.exports = router;