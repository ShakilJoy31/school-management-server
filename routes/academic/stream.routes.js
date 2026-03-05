const express = require("express");
const verifyBranchAdminUserJWT = require("../../middleware/jwtVerification/verifyJWT");
const { createStream, getAllStreams, getStreamById, updateStream, deleteStream } = require("../../controller/academic/stream.controller");
const router = express.Router();

// Stream routes with JWT verification
router.post("/create-stream", verifyBranchAdminUserJWT, createStream);
router.get("/get-stream-all", verifyBranchAdminUserJWT, getAllStreams);
router.get("/get-stream/:id", verifyBranchAdminUserJWT, getStreamById);
router.put("/update-stream/:id", verifyBranchAdminUserJWT, updateStream);
router.delete("/delete-stream/:id", verifyBranchAdminUserJWT, deleteStream);

module.exports = router;

