const { create_access_token } = require("../../config/jwt");
const SuperAdmin = require("../../models/Authentication/superadmin-model");
const bcrypt = require("bcryptjs");

// ===================== CREATE SUPER ADMIN =====================
const createSuperAdmin = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, photo, password, role, status } = req.body;

    const existing = await SuperAdmin.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await SuperAdmin.create({
      name,
      email,
      phoneNumber,
      photo,
      password: hashedPassword,
      role: role || "super-admin",
      status: status || "pending",
    });

    return res.status(201).json({
      message: "Super admin created successfully!",
      data: newAdmin,
    });

  } catch (error) {
    next(error);
  }
};


// ===================== LOGIN SUPER ADMIN =====================
const loginSuperAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await SuperAdmin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Email not found!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password!" });

    const payload = {
      id: admin.id,
      role: admin.role,
      email: admin.email,
    };

    const accessToken = create_access_token(payload);
    // const refreshToken = create_refresh_token(payload);

    return res.status(200).json({
      message: "Login successful!",
      token: accessToken,
      data: admin,
    });

  } catch (error) {
    next(error);
  }
};




// ===================== CHANGE PASSWORD =====================
const changePassword = async (req, res, next) => {
  try {
    const adminId = req.id;
    const { oldPassword, newPassword } = req.body;

    const admin = await SuperAdmin.findByPk(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found!" });

    const match = await bcrypt.compare(oldPassword, admin.password);
    if (!match) return res.status(401).json({ message: "Old password incorrect!" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    next(error);
  }
};


// ===================== UPDATE PROFILE =====================
const updateProfile = async (req, res) => {
  try {
    const adminId = req.params.id;

    await SuperAdmin.update(req.body, { where: { id: adminId } });

    // * Fetch the updated admin data
    const updatedAdmin = await SuperAdmin.findByPk(adminId, {
      attributes: { exclude: ['password'] }
    });

    // Check if admin exists
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully!",
      data: updatedAdmin,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===================== DELETE SUPER ADMIN =====================
const deleteSuperAdmin = async (req, res) => {
  try {
    if (req.role !== "super-admin")
      return res.status(403).json({ message: "Unauthorized!" });

    const { id } = req.params;

    await SuperAdmin.destroy({ where: { id } });

    res.status(200).json({ message: "Super admin deleted successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createSuperAdmin,
  loginSuperAdmin,
  changePassword,
  updateProfile,
  deleteSuperAdmin,
};
