const express = require("express");
const router = express.Router();
const { createSuperAdmin, loginSuperAdmin, changePassword, updateProfile, deleteSuperAdmin, getSuperAdminById } = require("../controller/auth/superadmin");
// const { createSuperAdmin, loginSuperAdmin, changePassword, updateProfile, deleteSuperAdmin } = require("../controller/auth/superAdmin");
const { createSchoolAdmin, loginSchoolAdmin, updateSchoolAdmin, deleteSchoolAdmin, getSchoolAdminById, getAllSchool } = require("../controller/auth/schoolAdmin");
const { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch, loginBranchAdmin } = require("../controller/auth/branchAdmin");
const { createBranchUser, loginBranchUser, getBranchUserById, updateBranchUser, deleteBranchUser, getAllBranchUsers, toggleUserStatus } = require("../controller/auth/branchAdminUser");
const { createTeacher, loginTeacher, getTeacherById, updateTeacher, deleteTeacher } = require("../controller/auth/teacherUser");
const verifySuperAdminJwt = require("../middleware/jwtVerification/superAdmin");
const verifySchoolJWT = require("../middleware/jwtVerification/schoolAdmin");
// const verifyBranchAdminJWT = require("../middleware/verifySuperAdminJwt");
// const verifyBranchAdminUserJWT = require("../middleware/verifySuperAdminJwt");






//! Routes for Super Admin.
// Public
router.post("/create-superadmin", createSuperAdmin);
router.post("/login-super-admin", loginSuperAdmin);
// Protected (requires JWT)
router.put("/change-password", verifySuperAdminJwt, changePassword);
router.put("/update-super-admin/:id", verifySuperAdminJwt, updateProfile);
router.delete("/delete-superadmin/:id", verifySuperAdminJwt, deleteSuperAdmin);
router.get("/get-super-admin-by-id/:id", verifySuperAdminJwt, getSuperAdminById)







//! Routes for school admin. 
router.post("/create-school", verifySuperAdminJwt, createSchoolAdmin); // public
router.post("/login-school", loginSchoolAdmin);   // public

router.put("/update-school/:id", verifySchoolJWT, updateSchoolAdmin);     // protected
router.delete("/delete-school/:id", verifySchoolJWT, deleteSchoolAdmin); // protected
router.get("/get-school-by-id/:id", verifySchoolJWT, getSchoolAdminById);   // protected
router.get("/get-school-all", verifySuperAdminJwt, getAllSchool)








//! Routes for branch admin. 
router.post("/create-branch", verifySchoolJWT, createBranch);
// router.post("/login-branch", loginBranchAdmin);

// Protected routes - require JWT verification
router.get("/get-branch-all", verifySchoolJWT, getAllBranches);
router.get("/get-branch/:id", verifySchoolJWT, getBranchById);
router.put("/update-branch/:id", verifySchoolJWT, updateBranch);
router.delete("/delete-branch/:id", verifySchoolJWT, deleteBranch);









//! Routes for branch admin user. 
router.post("/create-user", createBranchUser);
router.post("/login-user", loginBranchUser);
// Protected routes - with pagination and search
router.get("/get-user-all", getAllBranchUsers);
router.get("/get-user/:id", getBranchUserById);
router.put("/update-user/:id", updateBranchUser);
router.delete("/delete-user/:id", deleteBranchUser);
router.patch("/toggle-user-status/:id", toggleUserStatus);








//! Routes for teachers.
router.post("/teacher/create-teacher", createTeacher);
router.post("/teacher/login-teacher", loginTeacher);

// Protected
router.get("/teacher/:id", verifySuperAdminJwt, getTeacherById);
router.put("/teacher/:id", verifySuperAdminJwt, updateTeacher);
router.delete("/teacher/:id", verifySuperAdminJwt, deleteTeacher);








module.exports = router;














// ! This is a red alert comment
// * This is a green highlighted comment
// ? This is a blue question comment
// TODO: This is an orange todo comment