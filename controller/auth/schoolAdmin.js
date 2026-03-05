const bcrypt = require("bcryptjs");
const { create_access_token } = require("../../config/jwt");
const SchoolAdmin = require("../../models/Authentication/schoolAdmin.model");

// ===================== CREATE SCHOOL ADMIN =====================
const createSchoolAdmin = async (req, res, next) => {
  try {
    const { name, email, password, branchPermission } = req.body;

    const existing = await SchoolAdmin.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: "Email already exists!" });

    const hashedPass = await bcrypt.hash(password, 10);

    const newAdmin = await SchoolAdmin.create({
      name,
      email,
      password: hashedPass,
      branchPermission,
      role: "school-admin",
      status: "active",
    });

    return res.status(201).json({
      message: "School admin created successfully!",
      success: true,
      data: newAdmin,
    });
  } catch (error) {
    next(error);
  }
};

// ===================== LOGIN SCHOOL ADMIN =====================
const loginSchoolAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await SchoolAdmin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Email not found!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password!" });

    const payload = {
      id: admin.id,
      role: admin.role,
      email: admin.email,
    };

    const token = create_access_token(payload);

    return res.status(200).json({
      message: "Login successful!",
      accessToken: token,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

// ===================== UPDATE SCHOOL ADMIN =====================
const updateSchoolAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    await SchoolAdmin.update(req.body, { where: { id: adminId } });
    
    const updatedSchool = await SchoolAdmin.findByPk(adminId, {
      attributes: { exclude: ["password"] },
    });

    if (!updatedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully!",
      data: updatedSchool,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== DELETE SCHOOL ADMIN =====================
const deleteSchoolAdmin = async (req, res) => {
  try {
    // Only super admin can delete
    if (req.role !== "super-admin")
      return res.status(403).json({ message: "Unauthorized!" });

    const { id } = req.params;

    await SchoolAdmin.destroy({ where: { id } });

    res.status(200).json({
      message: "School admin deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== GET SCHOOL ADMIN BY ID =====================
const getSchoolAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await SchoolAdmin.findByPk(id);
    if (!admin)
      return res.status(404).json({ message: "School admin not found!" });

    res.status(200).json({ data: admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================== GET ALL SCHOOL ADMINS WITH PAGINATION =====================
const getAllSchool = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.size) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await SchoolAdmin.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']] // Optional: order by most recent first
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      message: "School admins retrieved successfully!",
      data: rows,
      pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


module.exports = {
  createSchoolAdmin,
  loginSchoolAdmin,
  updateSchoolAdmin,
  deleteSchoolAdmin,
  getSchoolAdminById,
  getAllSchool
};
