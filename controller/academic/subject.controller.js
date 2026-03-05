const { Op } = require("sequelize");
const Subject = require("../../models/academic/subject.model");

// =================== CREATE SUBJECT ===================
const createSubject = async (req, res, next) => {
  try {
    const { name, code, marks, passMarks } = req.body;

    // Validate required fields
    if (!name || !code || !marks || !passMarks) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, code, marks, passMarks) are required"
      });
    }

    // Check if subject with this name already exists
    const existingSubjectByName = await Subject.findOne({ 
      where: { 
        name: name.trim()
      } 
    });
    
    if (existingSubjectByName) {
      return res.status(409).json({
        success: false,
        message: "Subject with this name already exists"
      });
    }

    // Check if subject with this code already exists
    const existingSubjectByCode = await Subject.findOne({ 
      where: { 
        code: code.trim()
      } 
    });
    
    if (existingSubjectByCode) {
      return res.status(409).json({
        success: false,
        message: "Subject with this code already exists"
      });
    }

    // Validate passMarks is not greater than marks
    if (parseInt(passMarks) > parseInt(marks)) {
      return res.status(400).json({
        success: false,
        message: "Pass marks cannot be greater than total marks"
      });
    }

    // Create the subject
    const newSubject = await Subject.create({
      name: name.trim(),
      code: code.trim(),
      marks: parseInt(marks),
      passMarks: parseInt(passMarks)
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Subject created successfully",
      data: newSubject
    });

  } catch (error) {
    console.error("Create subject error:", error);
    next(error);
  }
};

// =================== GET ALL SUBJECTS (Paginated with Search) ===================
const getAllSubjects = async (req, res, next) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build search condition - search in name and code
    const whereCondition = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { code: { [Op.like]: `%${search}%` } }
        ]
      })
    };

    const { count, rows } = await Subject.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subjects retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all subjects error:", error);
    next(error);
  }
};

// =================== GET SUBJECT BY ID ===================
const getSubjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subjectData = await Subject.findByPk(id);

    if (!subjectData) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subject retrieved successfully",
      data: subjectData
    });

  } catch (error) {
    console.error("Get subject by id error:", error);
    next(error);
  }
};

// =================== UPDATE SUBJECT ===================
const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, marks, passMarks } = req.body;

    // Check if subject exists
    const subjectData = await Subject.findByPk(id);
    if (!subjectData) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    // If updating name, check if it's already taken
    if (name && name.trim() !== subjectData.name) {
      const nameExists = await Subject.findOne({
        where: {
          name: name.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Subject with this name already exists"
        });
      }
    }

    // If updating code, check if it's already taken
    if (code && code.trim() !== subjectData.code) {
      const codeExists = await Subject.findOne({
        where: {
          code: code.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (codeExists) {
        return res.status(409).json({
          success: false,
          message: "Subject with this code already exists"
        });
      }
    }

    // Validate passMarks is not greater than marks if both are being updated
    const newMarks = marks ? parseInt(marks) : subjectData.marks;
    const newPassMarks = passMarks ? parseInt(passMarks) : subjectData.passMarks;

    if (newPassMarks > newMarks) {
      return res.status(400).json({
        success: false,
        message: "Pass marks cannot be greater than total marks"
      });
    }

    // Update the subject
    if (name) subjectData.name = name.trim();
    if (code) subjectData.code = code.trim();
    if (marks) subjectData.marks = parseInt(marks);
    if (passMarks) subjectData.passMarks = parseInt(passMarks);

    await subjectData.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subject updated successfully",
      data: subjectData
    });

  } catch (error) {
    console.error("Update subject error:", error);
    next(error);
  }
};

// =================== DELETE SUBJECT ===================
const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if subject exists
    const subjectData = await Subject.findByPk(id);
    if (!subjectData) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    // Delete the subject
    await Subject.destroy({
      where: { id }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subject deleted successfully"
    });

  } catch (error) {
    console.error("Delete subject error:", error);
    next(error);
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};