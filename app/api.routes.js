
const authenticationRoutes = require("../routes/authentication.routes");
const classRoutes = require("../routes/academic/class.routes");
const sessionRoutes = require("../routes/academic/session.routes");
const sectionRoutes = require("../routes/academic/section.routes");
const streamRoutes = require("../routes/academic/stream.routes");
const subjectRoutes = require("../routes/academic/subject.routes");
const subjectGroup = require("../routes/academic/groupSubject.routes");
const student = require("../routes/students/student.routes");
const router = require("express").Router();

router.use("/super-admin", authenticationRoutes);
router.use("/school", authenticationRoutes);
router.use("/branch", authenticationRoutes);
router.use("/user", authenticationRoutes);



//! Routes for brance admin.......................................................
router.use("/class", classRoutes);
router.use("/session", sessionRoutes);
router.use("/section", sectionRoutes);
router.use("/stream", streamRoutes);
router.use("/subject", subjectRoutes);
router.use("/group-subject", subjectGroup);
router.use("/student", student);

module.exports = router;