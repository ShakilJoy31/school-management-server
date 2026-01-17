const bcrypt = require("bcryptjs");
const { create_access_token } = require("../../config/jwt");
const Teacher = require("../../models/Authentication/teacherUser.model");

// =================== CREATE TEACHER ===================
const createTeacher = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      designation,
      nid,
      gender,
      religion,
      dob,
      bloodGroup,
      address,
      universityName,
      qualification,
      specialistSubject,
      universityStartDate,
      universityEndDate,
      avatar,
    } = req.body;

    const exists = await Teacher.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      phone,
      email,
      password: hashedPassword,
      designation,
      nid,
      gender,
      religion,
      dob,
      bloodGroup,
      address,
      universityName,
      qualification,
      specialistSubject,
      universityStartDate,
      universityEndDate,
      avatar,
    });

    res.status(201).json({
      message: "Teacher created successfully!",
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

// =================== LOGIN TEACHER ===================
const loginTeacher = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const teacher = await Teacher.findOne({ where: { phone } });
    if (!teacher)
      return res.status(404).json({ message: "Phone not found!" });

    const match = await bcrypt.compare(password, teacher.password);
    if (!match)
      return res.status(401).json({ message: "Incorrect password!" });

    const payload = {
      id: teacher.id,
      role: "teacher",
      email: teacher.email,
    };

    const token = create_access_token(payload);

    res.status(200).json({
      message: "Teacher login successful!",
      token,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

// =================== GET TEACHER BY ID ===================
const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher)
      return res.status(404).json({ message: "Teacher not found!" });

    res.status(200).json({ data: teacher });
  } catch (error) {
    next(error);
  }
};

// =================== UPDATE TEACHER ===================
const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.id !== Number(id))
      return res.status(403).json({ message: "Unauthorized!" });

    await Teacher.update(req.body, { where: { id } });

    res.status(200).json({ message: "Teacher updated successfully!" });
  } catch (error) {
    next(error);
  }
};

// =================== DELETE TEACHER ===================
const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.id !== Number(id))
      return res.status(403).json({ message: "Unauthorized!" });

    await Teacher.destroy({ where: { id } });

    res.status(200).json({ message: "Teacher deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  loginTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
