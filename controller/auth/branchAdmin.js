
const bcrypt = require("bcryptjs");
// const { create_access_token } = require("../../config/jwt");
const Branch = require("../../models/Authentication/branchAdmin.model");

// ===================== CREATE BRANCH =====================
const createBranch = async (req, res, next) => {
  try {
    const {
      name,
      location,
      address,
      email,
      hotline,
      phone,
      principalVoice,
      vicePrincipalVoice,
      eiin,
      password
    } = req.body;

    const exists = await Branch.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const branch = await Branch.create({
      name,
      location,
      address,
      email,
      hotline,
      phone,
      principalVoice,
      vicePrincipalVoice,
      eiin,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Branch created successfully!",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

// ===================== LOGIN BRANCH ADMIN =====================
// const loginBranchAdmin = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const branch = await Branch.findOne({ where: { email } });
//     if (!branch)
//       return res.status(404).json({ message: "Email not found!" });

//     const match = await bcrypt.compare(password, branch.password);
//     if (!match)
//       return res.status(401).json({ message: "Incorrect password!" });

//     const payload = {
//       id: branch.id,
//       role: "branch-admin",
//       email: branch.email,
//     };

//     const token = create_access_token(payload);

//     res.status(200).json({
//       message: "Login successful!",
//       token,
//       data: branch,
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// ===================== GET ALL BRANCHES =====================
const getAllBranches = async (req, res, next) => {
  try {
    const branches = await Branch.findAll();
    res.status(200).json({ data: branches });
  } catch (error) {
    next(error);
  }
};

// ===================== GET BRANCH BY ID =====================
const getBranchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findByPk(id);
    if (!branch) return res.status(404).json({ message: "Branch not found!" });

    res.status(200).json({ data: branch });
  } catch (error) {
    next(error);
  }
};

// ===================== UPDATE BRANCH =====================
const updateBranch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const exists = await Branch.findByPk(id);
    if (!exists) return res.status(404).json({ message: "Branch not found!" });

    await Branch.update(req.body, { where: { id } });

    const updatedBranch = await Branch.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found"});
    }

    res.status(200).json({ message: "Branch updated successfully!", data: updatedBranch  });
  } catch (error) {
    next(error);
  }
};

// ===================== DELETE BRANCH =====================
const deleteBranch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const exists = await Branch.findByPk(id);
    if (!exists) return res.status(404).json({ message: "Branch not found!" });

    await Branch.destroy({ where: { id } });

    res.status(200).json({ message: "Branch deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBranch,
//   loginBranchAdmin,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
