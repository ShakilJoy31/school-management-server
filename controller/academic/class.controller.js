
const { Op } = require("sequelize");
const Class = require("../../models/academic/class.model");

// =================== CREATE CLASS ===================
const createClass = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Class name is required"
      });
    }

    // Check if class with this name already exists
    const existingClass = await Class.findOne({ 
      where: { name: name.trim() } 
    });
    
    if (existingClass) {
      return res.status(409).json({
        success: false,
        message: "Class with this name already exists"
      });
    }

    // Create the class
    const newClass = await Class.create({
      name: name.trim()
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Class created successfully",
      data: newClass
    });

  } catch (error) {
    console.error("Create class error:", error);
    next(error);
  }
};

// =================== GET ALL CLASSES (Paginated) ===================
const getAllClasses = async (req, res, next) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build search condition
    const whereCondition = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } }
        ]
      })
    };

    const { count, rows } = await Class.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Classes retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all classes error:", error);
    next(error);
  }
};

// =================== GET CLASS BY ID ===================
const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const classData = await Class.findByPk(id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Class retrieved successfully",
      data: classData
    });

  } catch (error) {
    console.error("Get class by id error:", error);
    next(error);
  }
};

// =================== UPDATE CLASS ===================
const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log("Update class data:", { id, name });

    // Check if class exists
    const classData = await Class.findByPk(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // If updating name, check if it's already taken
    if (name && name.trim() !== classData.name) {
      const nameExists = await Class.findOne({
        where: {
          name: name.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Class with this name already exists"
        });
      }
    }

    // Update the class
    if (name) {
      classData.name = name.trim();
      await classData.save();
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Class updated successfully",
      data: classData
    });

  } catch (error) {
    console.error("Update class error:", error);
    next(error);
  }
};

// =================== DELETE CLASS ===================
const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if class exists
    const classData = await Class.findByPk(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Delete the class
    await Class.destroy({
      where: { id }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Class deleted successfully"
    });

  } catch (error) {
    console.error("Delete class error:", error);
    next(error);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};
