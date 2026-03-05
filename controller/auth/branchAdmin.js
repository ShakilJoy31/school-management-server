const bcrypt = require("bcryptjs");
const { create_access_token } = require("../../config/jwt");
const Branch = require("../../models/Authentication/branchAdmin.model");
const { Op } = require("sequelize");

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
      schoolId // This should come from the request body
    } = req.body;

    // Validate required fields
    if (!name || !location || !address || !email || !schoolId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, location, address, email, and schoolId are required"
      });
    }

    // Check if branch with this email already exists
    const exists = await Branch.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ 
        success: false,
        message: "Email already exists!" 
      });
    }

    // Create branch - NO PASSWORD field since it's not in payload
    const branchData = {
      name,
      location,
      address,
      email,
      hotline,
      phone,
      principalVoice,
      vicePrincipalVoice,
      eiin,
      schoolId // Use schoolId from request body
    };

    const branch = await Branch.create(branchData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Branch created successfully!",
      data: branch,
    });
  } catch (error) {
    console.error("Create branch error:", error);
    next(error);
  }
};

// ===================== LOGIN BRANCH ADMIN =====================
// Comment this out since branches don't have passwords
/*
const loginBranchAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const branch = await Branch.findOne({ where: { email } });
    if (!branch) {
      return res.status(404).json({ 
        success: false,
        message: "Email not found!" 
      });
    }

    const match = await bcrypt.compare(password, branch.password);
    if (!match) {
      return res.status(401).json({ 
        success: false,
        message: "Incorrect password!" 
      });
    }

    const payload = {
      id: branch.id,
      schoolId: branch.schoolId,
      role: "branch-admin",
      email: branch.email,
    };

    const token = create_access_token(payload);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Login successful!",
      token,
      data: branch,
    });

  } catch (error) {
    next(error);
  }
};
*/

// ===================== GET ALL BRANCHES (Paginated) =====================
const getAllBranches = async (req, res, next) => {
  try {
    const { page = 1, size = 10, id: schoolId } = req.query;

    // Validate schoolId
    if (!schoolId) {
      return res.status(400).json({
        success: false,
        message: "School ID is required"
      });
    }

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const { count, rows } = await Branch.findAndCountAll({
      where: { schoolId },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Branch retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// ===================== GET BRANCH BY ID =====================
const getBranchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findByPk(id);
    
    if (!branch) {
      return res.status(404).json({ 
        success: false,
        message: "Branch not found!" 
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Branch retrieved successfully",
      data: branch
    });
  } catch (error) {
    next(error);
  }
};

// ===================== UPDATE BRANCH =====================
const updateBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.schoolId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const branch = await Branch.findByPk(id);
    if (!branch) {
      return res.status(404).json({ 
        success: false,
        message: "Branch not found!" 
      });
    }

    // Check if school has permission to update this branch
    if (req.school && branch.schoolId !== req.school.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this branch"
      });
    }

    // If updating email, check if it's already taken
    if (updateData.email && updateData.email !== branch.email) {
      const existingBranch = await Branch.findOne({ 
        where: { 
          email: updateData.email,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingBranch) {
        return res.status(409).json({
          success: false,
          message: "Email already exists!"
        });
      }
    }

    await Branch.update(updateData, { 
      where: { id }
    });

    const updatedBranch = await Branch.findByPk(id);

    res.status(200).json({ 
      success: true,
      statusCode: 200,
      message: "Branch updated successfully!", 
      data: updatedBranch 
    });
  } catch (error) {
    next(error);
  }
};

// ===================== DELETE BRANCH =====================
const deleteBranch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findByPk(id);
    if (!branch) {
      return res.status(404).json({ 
        success: false,
        message: "Branch not found!" 
      });
    }

    // Check if school has permission to delete this branch
    if (req.school && branch.schoolId !== req.school.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this branch"
      });
    }

    await Branch.destroy({ where: { id } });

    res.status(200).json({ 
      success: true,
      statusCode: 200,
      message: "Branch deleted successfully!" 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBranch,
  // loginBranchAdmin, // Commented out since no password
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};