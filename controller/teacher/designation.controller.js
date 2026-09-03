const { Op } = require("sequelize");
const Designation = require("../../models/teacher/designation.model");

//! =================== CREATE DESIGNATION ===================
const createDesignation = async (req, res, next) => {
  try {
    const { name, status } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Designation name is required"
      });
    }

    // Check if designation already exists (case-insensitive for MySQL)
    const existingDesignation = await Designation.findOne({
      where: { 
        name: name.trim()
      }
    });

    if (existingDesignation) {
      return res.status(409).json({
        success: false,
        message: "Designation with this name already exists"
      });
    }

    // Create designation
    const newDesignation = await Designation.create({
      name: name.trim(),
      status: status || 'Active'
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Designation created successfully",
      data: newDesignation
    });

  } catch (error) {
    console.error("Create designation error:", error);
    next(error);
  }
};

// =================== GET ALL DESIGNATIONS (Paginated with Search) ===================
const getAllDesignations = async (req, res, next) => {
  try {
    const { page = 1, size = 10, search = '', status } = req.query;

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build where condition
    const whereCondition = {};

    // Add status filter if provided
    if (status && status !== '0' && status !== 0) {
      whereCondition.status = status;
    }

    // Add search condition (MySQL uses LIKE which is case-insensitive by default)
    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ];
    }

    // Get all designations with pagination
    const { count, rows } = await Designation.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Designations retrieved successfully",
      data: rows,
      meta: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPage: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all designations error:", error);
    next(error);
  }
};

// =================== GET DESIGNATION BY ID ===================
const getDesignationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findByPk(id);

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found"
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Designation retrieved successfully",
      data: designation
    });

  } catch (error) {
    console.error("Get designation by id error:", error);
    next(error);
  }
};

//! =================== UPDATE DESIGNATION ===================
const updateDesignation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    // Check if designation exists
    const designation = await Designation.findByPk(id);

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found"
      });
    }

    // If updating name, check if it's already taken
    if (name && name.trim() !== designation.name) {
      const nameExists = await Designation.findOne({
        where: {
          name: name.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Designation with this name already exists"
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (status) updateData.status = status;

    // Update designation
    await Designation.update(updateData, {
      where: { id }
    });

    // Get updated designation
    const updatedDesignation = await Designation.findByPk(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Designation updated successfully",
      data: updatedDesignation
    });

  } catch (error) {
    console.error("Update designation error:", error);
    next(error);
  }
};

//! =================== DELETE DESIGNATION ===================
const deleteDesignation = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if designation exists
    const designation = await Designation.findByPk(id);

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found"
      });
    }

    // Delete the designation
    await Designation.destroy({
      where: { id }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Designation deleted successfully"
    });

  } catch (error) {
    console.error("Delete designation error:", error);
    next(error);
  }
};

module.exports = {
  createDesignation,
  getAllDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation
};