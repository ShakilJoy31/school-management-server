const express = require("express");
const router = express.Router();
const { createSuperAdmin, loginSuperAdmin, changePassword, updateProfile, deleteSuperAdmin, getSuperAdminById } = require("../controller/auth/superadmin");
// const { createSuperAdmin, loginSuperAdmin, changePassword, updateProfile, deleteSuperAdmin } = require("../controller/auth/superAdmin");
const { createSchoolAdmin, loginSchoolAdmin, updateSchoolAdmin, deleteSchoolAdmin, getSchoolAdminById, getAllSchool } = require("../controller/auth/schoolAdmin");
const { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch } = require("../controller/auth/branchAdmin");
const { createBranchUser, loginBranchUser, getBranchUserById, updateBranchUser, deleteBranchUser } = require("../controller/auth/branchAdminUser");
const { createTeacher, loginTeacher, getTeacherById, updateTeacher, deleteTeacher } = require("../controller/auth/teacherUser");
const { createStudent, loginStudent, getStudentById, updateStudent, deleteStudent } = require("../controller/auth/studentUser");
const verifySuperAdminJwt = require("../middleware/jwtVerification/superAdmin");
const verifySchoolJWT = require("../middleware/jwtVerification/schoolAdmin");
// const verifyBranchAdminJWT = require("../middleware/verifySuperAdminJwt");
// const verifyBranchAdminUserJWT = require("../middleware/verifySuperAdminJwt");






//! Routes for Super Admin.
// Public
router.post("/create-superadmin", createSuperAdmin);
router.post("/login-super-admin", loginSuperAdmin)
// Protected (requires JWT)
router.put("/change-password", verifySuperAdminJwt, changePassword);
router.put("/update-super-admin/:id", verifySuperAdminJwt, updateProfile);
router.delete("/delete-superadmin/:id", verifySuperAdminJwt, deleteSuperAdmin);
router.get("/get-super-admin-by-id/:id", verifySuperAdminJwt, getSuperAdminById)







//! Routes for school admin. 
router.post("/create-school", verifySuperAdminJwt, createSchoolAdmin); // public
router.post("/login-school", loginSchoolAdmin);   // public

router.put("/school/update-school/:id", verifySuperAdminJwt, updateSchoolAdmin);     // protected
router.delete("/delete-school/:id", verifySuperAdminJwt, deleteSchoolAdmin); // protected
router.get("/get-school/:id", verifySuperAdminJwt, getSchoolAdminById);   // protected
router.get("/get-school-all", verifySuperAdminJwt, getAllSchool)




//! Routes for branch admin. 

router.post("/create-branch", createBranch);
// router.post("/login-branch", loginBranchAdmin);

router.get("/branches", getAllBranches);
router.get("/branch/:id", getBranchById);

// Protected
router.put("/branch/update-branch/:id", verifySchoolJWT, updateBranch);
router.delete("/delete-branch/:id", verifySchoolJWT, deleteBranch);





//! Routes for branch admin users.
router.post("/user/create-user", createBranchUser);
router.post("/user/login-user", loginBranchUser);

// Protected
router.get("/branch-user/:id", verifySchoolJWT, getBranchUserById);
router.put("/user/update-user/:id", verifySchoolJWT, updateBranchUser);
router.delete("/branch-user/:id", verifySchoolJWT, deleteBranchUser);








//! Routes for teachers.
router.post("/teacher/create-teacher", createTeacher);
router.post("/teacher/login-teacher", loginTeacher);

// Protected
router.get("/teacher/:id", verifySuperAdminJwt, getTeacherById);
router.put("/teacher/:id", verifySuperAdminJwt, updateTeacher);
router.delete("/teacher/:id", verifySuperAdminJwt, deleteTeacher);









//! Routes for students.
// Public
router.post("/student/create-student", createStudent);
router.post("/student/login-student", loginStudent);

// Protected
router.get("/student/:id", verifySuperAdminJwt, getStudentById);
router.put("/student/:id", verifySuperAdminJwt, updateStudent);
router.delete("/student/:id", verifySuperAdminJwt, deleteStudent);
















module.exports = router;














// ! This is a red alert comment
// * This is a green highlighted comment
// ? This is a blue question comment
// TODO: This is an orange todo comment