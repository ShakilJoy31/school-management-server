const bcrypt = require("bcryptjs");
const { create_access_token } = require("../../config/jwt");
const BranchUser = require("../../models/Authentication/branchAdminUser.model");
const { Op } = require("sequelize");
const Branch = require("../../models/Authentication/branchAdmin.model");
const sequelize = require("../../database/connection");

// =================== CREATE BRANCH USER ===================
const createBranchUser = async (req, res, next) => {
  try {
    const { name, branchId, phone, email, password } = req.body;

    // Validate required fields
    if (!name || !branchId || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, branchId, phone, email, and password are required"
      });
    }

    // Check if user with this email already exists
    const emailExists = await BranchUser.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists!"
      });
    }

    // Check if user with this phone already exists
    const phoneExists = await BranchUser.findOne({ where: { phone } });
    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists!"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const branchUser = await BranchUser.create({
      name,
      branchId,
      phone,
      email,
      password: hashedPassword,
      status: 'active' // Default status
    });

    // Remove password from response
    const userResponse = branchUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Branch user created successfully!",
      data: userResponse,
    });
  } catch (error) {
    console.error("Create branch user error:", error);
    next(error);
  }
};

// =================== LOGIN BRANCH USER ===================
const loginBranchUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required"
      });
    }

    const user = await BranchUser.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Phone not found!"
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please contact administrator."
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password!"
      });
    }

    const payload = {
      id: user.id,
      role: "branch-user",
      email: user.email,
      branchId: user.branchId,
      phone: user.phone
    };

    const token = create_access_token(payload);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Login successful!",
      accessToken: token,
      data: userResponse,
    });
  } catch (error) {
    console.error("Login branch user error:", error);
    next(error);
  }
};
















//! =================== GET ALL BRANCH USERS (Paginated) ===================
//! =================== GET ALL BRANCH USERS (Paginated) ===================
const getAllBranchUsers = async (req, res, next) => {
  try {
    const { page = 1, size = 10, search = '', branchId } = req.query;

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build the WHERE clause conditions
    let whereConditions = [];
    let replacements = { limit, offset };

    if (branchId) {
      whereConditions.push('bu.branchId = :branchId');
      replacements.branchId = branchId;
    }

    if (search) {
      whereConditions.push(`(bu.name LIKE :search OR bu.email LIKE :search OR bu.phone LIKE :search)`);
      replacements.search = `%${search}%`;
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ') 
      : '';

    // Main query to get users with branch name
    const query = `
      SELECT 
        bu.id, 
        bu.name, 
        bu.branchId, 
        bu.phone, 
        bu.email, 
        bu.status, 
        bu.createdAt, 
        bu.updatedAt,
        b.name as branch_name
      FROM branch_users bu
      LEFT JOIN branches b ON bu.branchId = b.id
      ${whereClause}
      ORDER BY bu.createdAt DESC
      LIMIT :limit OFFSET :offset
    `;

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM branch_users bu
      LEFT JOIN branches b ON bu.branchId = b.id
      ${whereClause}
    `;

    // Execute both queries
    const [users, totalResult] = await Promise.all([
      sequelize.query(query, { 
        replacements,
        type: sequelize.QueryTypes.SELECT 
      }),
      sequelize.query(countQuery, { 
        replacements,
        type: sequelize.QueryTypes.SELECT 
      })
    ]);

    // Format the response to match frontend expectations
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      branchId: user.branchId,
      phone: user.phone,
      email: user.email,
      status: user.status || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      branch: {
        id: user.branchId,
        name: user.branch_name || 'N/A'
      }
    }));

    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Branch users retrieved successfully",
      data: formattedUsers,
      pagination: {
        total: total,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get all branch users error:", error);
    next(error);
  }
};







// =================== GET USER BY ID ===================
const getBranchUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await BranchUser.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    console.error("Get branch user by id error:", error);
    next(error);
  }
};

// =================== UPDATE BRANCH USER ===================
const updateBranchUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updateData = { ...req.body };

    console.log("Received update data:", updateData);

    // Check if user exists first
    const user = await BranchUser.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Branch User not found"
      });
    }

    // Remove fields that shouldn't be updated directly (but handle password separately)
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Handle password separately - only update if provided and not empty
    if (updateData.password) {
      if (updateData.password.trim() !== '') {
        // Hash the new password
        updateData.password = await bcrypt.hash(updateData.password, 10);
      } else {
        // Remove empty password from update data
        delete updateData.password;
      }
    }

    // If updating email, check if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await BranchUser.findOne({
        where: {
          email: updateData.email,
          id: { [Op.ne]: id }
        }
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already exists!"
        });
      }
    }

    // If updating phone, check if it's already taken
    if (updateData.phone && updateData.phone !== user.phone) {
      const phoneExists = await BranchUser.findOne({
        where: {
          phone: updateData.phone,
          id: { [Op.ne]: id }
        }
      });

      if (phoneExists) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists!"
        });
      }
    }

    console.log("Final update data before save:", updateData);

    // Only update if there's data to update
    if (Object.keys(updateData).length > 0) {
      await BranchUser.update(updateData, {
        where: { id },
        individualHooks: true
      });
    }

    const updatedBranchUser = await BranchUser.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Branch User updated successfully!",
      data: updatedBranchUser
    });
  } catch (error) {
    console.error("Update branch user error:", error);
    next(error);
  }
};






//! =================== DELETE BRANCH USER ===================
const deleteBranchUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await BranchUser.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    // Check permission - only allow if user is from same branch or has admin rights
    if (req.user && req.user.branchId && user.branchId !== req.user.branchId && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this user"
      });
    }

    await BranchUser.destroy({ where: { id } });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User deleted successfully!"
    });
  } catch (error) {
    console.error("Delete branch user error:", error);
    next(error);
  }
};

// =================== TOGGLE USER STATUS ===================
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'active' or 'inactive'"
      });
    }

    const user = await BranchUser.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    // Check permission
    if (req.user && req.user.branchId && user.branchId !== req.user.branchId && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to change this user's status"
      });
    }

    await BranchUser.update({ status }, { where: { id } });

    const updatedUser = await BranchUser.findByPk(id, {
      attributes: { exclude: ["password"] }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `User status updated to ${status}`,
      data: updatedUser
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    next(error);
  }
};

module.exports = {
  createBranchUser,
  loginBranchUser,
  getAllBranchUsers,
  getBranchUserById,
  updateBranchUser,
  deleteBranchUser,
  toggleUserStatus,
};