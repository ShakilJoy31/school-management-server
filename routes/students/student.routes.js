const express = require("express");
const verifyBranchAdminUserJWT = require("../../middleware/jwtVerification/verifyJWT");
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } = require("../../controller/student/student.controller");
const router = express.Router();

// Student routes with JWT verification
router.post("/create-student", verifyBranchAdminUserJWT, createStudent);
router.get("/get-student-all", verifyBranchAdminUserJWT, getAllStudents);
router.get("/get-student-by-id/:id", verifyBranchAdminUserJWT, getStudentById);
router.put("/update-student/:id", verifyBranchAdminUserJWT, updateStudent);
router.delete("/delete-student/:id", verifyBranchAdminUserJWT, deleteStudent);

module.exports = router;