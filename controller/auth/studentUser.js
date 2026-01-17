const bcrypt = require("bcryptjs");
const { create_access_token } = require("../../config/jwt");
const Student = require("../../models/Authentication/studentUser.model");

// =================== CREATE STUDENT ===================
const createStudent = async (req, res, next) => {
  try {
    const {
      sessionYearId,
      name,
      phone,
      email,
      password,
      classNameId,
      classRoll,
      sectionNameId,
      streamNameId,
      gender,
      religion,
      dob,
      bloodGroup,
      address,
      fatherName,
      motherName,
      parentPhone,
      avatar,
      subjects,
    } = req.body;

    const exists = await Student.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      sessionYearId,
      name,
      phone,
      email,
      password: hashedPassword,
      classNameId,
      classRoll,
      sectionNameId,
      streamNameId,
      gender,
      religion,
      dob,
      bloodGroup,
      address,
      fatherName,
      motherName,
      parentPhone,
      avatar,
      subjects,
    });

    res.status(201).json({
      message: "Student created successfully!",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// =================== LOGIN STUDENT ===================
const loginStudent = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const student = await Student.findOne({ where: { phone } });
    if (!student)
      return res.status(404).json({ message: "Phone not found!" });

    const match = await bcrypt.compare(password, student.password);
    if (!match)
      return res.status(401).json({ message: "Incorrect password!" });

    const payload = {
      id: student.id,
      role: "student",
      email: student.email,
    };

    const token = create_access_token(payload);

    res.status(200).json({
      message: "Student login successful!",
      token,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// =================== GET STUDENT BY ID ===================
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found!" });

    res.status(200).json({ data: student });
  } catch (error) {
    next(error);
  }
};

// =================== UPDATE STUDENT ===================
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.id !== Number(id))
      return res.status(403).json({ message: "Unauthorized!" });

    await Student.update(req.body, { where: { id } });

    res.status(200).json({ message: "Student updated successfully!" });
  } catch (error) {
    next(error);
  }
};

// =================== DELETE STUDENT ===================
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.id !== Number(id))
      return res.status(403).json({ message: "Unauthorized!" });

    await Student.destroy({ where: { id } });

    res.status(200).json({ message: "Student deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  loginStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
};
