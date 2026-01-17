
const bcrypt = require("bcryptjs");
const { create_access_token } = require("../../config/jwt");
const BranchUser = require("../../models/Authentication/branchAdminUser.model");

// =================== CREATE BRANCH USER ===================
const createBranchUser = async (req, res, next) => {
  try {
    const { name, branchId, phone, email, password } = req.body;

    const exists = await BranchUser.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const branchUser = await BranchUser.create({
      name,
      branchId,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Branch user created successfully!",
      data: branchUser,
    });
  } catch (error) {
    next(error);
  }
};

// =================== LOGIN BRANCH USER ===================
const loginBranchUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const user = await BranchUser.findOne({ where: { phone } });
    if (!user)
      return res.status(404).json({ message: "Phone not found!" });

    const match = await bcrypt.compare(password, user.password);
    console.log(password, user.password, match)
    if (password !== user.password)
      return res.status(401).json({ message: "Incorrect password!" });

    const payload = {
      id: user.id,
      role: "branch-user",
      email: user.email,
      branchId: user.branchId,
    };

    const token = create_access_token(payload);

    res.status(200).json({
      message: "Login successful!",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// =================== GET USER BY ID ===================
const getBranchUserById = async (req, res, next) => {
  try {
    const user = await BranchUser.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found!" });

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

// =================== UPDATE BRANCH USER ===================
const updateBranchUser = async (req, res, next) => {
  try {
    const id  = Number(req.params.id);

    await BranchUser.update(req.body, { where: { id } });


    const updatedBranchUser = await BranchUser.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!updatedBranchUser) {
      return res.status(404).json({ message: "Branch User not found"});
    }

    res.status(200).json({ message: "Branch User updated successfully!", updatedBranchUser });
  } catch (error) {
    next(error);
  }
};

// =================== DELETE BRANCH USER ===================
const deleteBranchUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.id !== Number(id))
      return res.status(403).json({ message: "Unauthorized!" });

    await BranchUser.destroy({ where: { id } });

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBranchUser,
  loginBranchUser,
  getBranchUserById,
  updateBranchUser,
  deleteBranchUser,
};
