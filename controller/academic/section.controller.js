const { Op } = require("sequelize");
const Section = require("../../models/academic/section.model");

// =================== CREATE SECTION ===================
const createSection = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Section name is required"
      });
    }


    // Check if section with this name already exists in the same branch
    const existingSection = await Section.findOne({ 
      where: { 
        name: name.trim(),
      } 
    });
    
    if (existingSection) {
      return res.status(409).json({
        success: false,
        message: "Section with this name already exists in this branch"
      });
    }

    // Create the section
    const newSection = await Section.create({
      name: name.trim(),
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Section created successfully",
      data: newSection
    });

  } catch (error) {
    console.error("Create section error:", error);
    next(error);
  }
};

// =================== GET ALL SECTIONS (Paginated) ===================
const getAllSections = async (req, res, next) => {
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

    const { count, rows } = await Section.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Sections retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all sections error:", error);
    next(error);
  }
};

// =================== GET SECTION BY ID ===================
const getSectionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sectionData = await Section.findByPk(id);

    if (!sectionData) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Section retrieved successfully",
      data: sectionData
    });

  } catch (error) {
    console.error("Get section by id error:", error);
    next(error);
  }
};

// =================== UPDATE SECTION ===================
const updateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log("Update section data:", { id, name });

    // Check if section exists
    const sectionData = await Section.findByPk(id);
    if (!sectionData) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    // If updating name, check if it's already taken in the same branch
    if (name && name.trim() !== sectionData.name) {
      const nameExists = await Section.findOne({
        where: {
          name: name.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Section with this name already exists in this branch"
        });
      }
    }

    // Update the section
    if (name) {
      sectionData.name = name.trim();
      await sectionData.save();
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Section updated successfully",
      data: sectionData
    });

  } catch (error) {
    console.error("Update section error:", error);
    next(error);
  }
};

// =================== DELETE SECTION ===================
const deleteSection = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if section exists
    const sectionData = await Section.findByPk(id);
    if (!sectionData) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    // Delete the section
    await Section.destroy({
      where: { id }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Section deleted successfully"
    });

  } catch (error) {
    console.error("Delete section error:", error);
    next(error);
  }
};




module.exports = {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection,
};