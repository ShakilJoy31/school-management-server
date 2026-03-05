const { Op } = require("sequelize");
const GroupSubject = require("../../models/academic/groupSubject.model");
const Class = require("../../models/academic/class.model");
const Subject = require("../../models/academic/subject.model");

// =================== CREATE GROUP SUBJECT ===================
const createGroupSubject = async (req, res, next) => {
  try {
    const { classNameId, subjectNameId } = req.body;

    // Validate required fields
    if (!classNameId || !subjectNameId) {
      return res.status(400).json({
        success: false,
        message: "Class ID and Subject IDs are required"
      });
    }

    // Check if class exists
    const classExists = await Class.findByPk(classNameId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // subjectNameId can be a single ID or an array of IDs
    const subjectIds = Array.isArray(subjectNameId) ? subjectNameId : [subjectNameId];

    // Check if all subjects exist
    for (const subjectId of subjectIds) {
      const subjectExists = await Subject.findByPk(subjectId);
      if (!subjectExists) {
        return res.status(404).json({
          success: false,
          message: `Subject with ID ${subjectId} not found`
        });
      }
    }

    // Create group subjects (one for each subject)
    const createdGroups = [];
    for (const subjectId of subjectIds) {
      // Check if this combination already exists
      const existingGroup = await GroupSubject.findOne({
        where: {
          classNameId,
          subjectNameId: subjectId
        }
      });

      if (!existingGroup) {
        const newGroup = await GroupSubject.create({
          classNameId,
          subjectNameId: subjectId
        });
        createdGroups.push(newGroup);
      }
    }

    // Get the created groups with subject and class details
    const groupsWithDetails = [];
    for (const group of createdGroups) {
      const classData = await Class.findByPk(group.classNameId);
      const subjectData = await Subject.findByPk(group.subjectNameId);
      
      groupsWithDetails.push({
        id: group.id,
        classNameId: group.classNameId,
        subjectNameId: group.subjectNameId,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        class: classData ? {
          id: classData.id,
          name: classData.name,
          createdAt: classData.createdAt,
          updatedAt: classData.updatedAt
        } : null,
        subject: subjectData ? {
          id: subjectData.id,
          name: subjectData.name,
          code: subjectData.code,
          marks: subjectData.marks,
          passMarks: subjectData.passMarks,
          createdAt: subjectData.createdAt,
          updatedAt: subjectData.updatedAt
        } : null
      });
    }

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Group subject created successfully",
      data: groupsWithDetails.length === 1 ? groupsWithDetails[0] : groupsWithDetails
    });

  } catch (error) {
    console.error("Create group subject error:", error);
    next(error);
  }
};

// =================== GET ALL GROUP SUBJECTS (Paginated with Search) ===================
const getAllGroupSubjects = async (req, res, next) => {
  try {
    const { page = 1, size = 10, search = '', classId } = req.query;

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build where condition
    const whereCondition = {};

    // Add class filter if provided
    if (classId && classId !== '0' && classId !== 0) {
      whereCondition.classNameId = classId;
    }

    // Get all group subjects with pagination
    const { count, rows } = await GroupSubject.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Enhance rows with class and subject details
    const enhancedRows = [];
    for (const row of rows) {
      const classData = await Class.findByPk(row.classNameId);
      const subjectData = await Subject.findByPk(row.subjectNameId);
      
      // Apply search filter on class name and subject name
      if (search) {
        const searchLower = search.toLowerCase();
        const className = classData?.name?.toLowerCase() || '';
        const subjectName = subjectData?.name?.toLowerCase() || '';
        
        if (!className.includes(searchLower) && !subjectName.includes(searchLower)) {
          continue; // Skip this row if it doesn't match search
        }
      }

      enhancedRows.push({
        id: row.id,
        classNameId: row.classNameId,
        subjectNameId: row.subjectNameId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        class: classData ? {
          id: classData.id,
          name: classData.name,
          createdAt: classData.createdAt,
          updatedAt: classData.updatedAt
        } : null,
        subject: subjectData ? {
          id: subjectData.id,
          name: subjectData.name,
          code: subjectData.code,
          marks: subjectData.marks,
          passMarks: subjectData.passMarks,
          createdAt: subjectData.createdAt,
          updatedAt: subjectData.updatedAt
        } : null
      });
    }

    // Apply pagination after filtering
    const paginatedRows = enhancedRows.slice(offset, offset + limit);
    const filteredCount = enhancedRows.length;

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Group subjects retrieved successfully",
      data: paginatedRows,
      meta: {
        total: filteredCount,
        page: parseInt(page),
        size: limit,
        totalPage: Math.ceil(filteredCount / limit)
      }
    });

  } catch (error) {
    console.error("Get all group subjects error:", error);
    next(error);
  }
};

// =================== GET GROUP SUBJECT BY ID ===================
const getGroupSubjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const groupData = await GroupSubject.findByPk(id);

    if (!groupData) {
      return res.status(404).json({
        success: false,
        message: "Group subject not found"
      });
    }

    // Get class and subject details
    const classData = await Class.findByPk(groupData.classNameId);
    const subjectData = await Subject.findByPk(groupData.subjectNameId);

    const enhancedData = {
      id: groupData.id,
      classNameId: groupData.classNameId,
      subjectNameId: groupData.subjectNameId,
      createdAt: groupData.createdAt,
      updatedAt: groupData.updatedAt,
      class: classData ? {
        id: classData.id,
        name: classData.name,
        createdAt: classData.createdAt,
        updatedAt: classData.updatedAt
      } : null,
      subject: subjectData ? {
        id: subjectData.id,
        name: subjectData.name,
        code: subjectData.code,
        marks: subjectData.marks,
        passMarks: subjectData.passMarks,
        createdAt: subjectData.createdAt,
        updatedAt: subjectData.updatedAt
      } : null
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Group subject retrieved successfully",
      data: enhancedData
    });

  } catch (error) {
    console.error("Get group subject by id error:", error);
    next(error);
  }
};

// =================== UPDATE GROUP SUBJECT ===================
const updateGroupSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { classNameId, subjectNameId } = req.body;

    // Check if group subject exists
    const groupData = await GroupSubject.findByPk(id);

    if (!groupData) {
      return res.status(404).json({
        success: false,
        message: "Group subject not found"
      });
    }

    // If updating class, check if class exists
    if (classNameId && classNameId !== groupData.classNameId) {
      const classExists = await Class.findByPk(classNameId);
      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: "Class not found"
        });
      }
    }

    // If updating subject, check if subject exists
    if (subjectNameId && subjectNameId !== groupData.subjectNameId) {
      const subjectExists = await Subject.findByPk(subjectNameId);
      if (!subjectExists) {
        return res.status(404).json({
          success: false,
          message: "Subject not found"
        });
      }

      // Check if the new combination already exists
      const existingGroup = await GroupSubject.findOne({
        where: {
          classNameId: classNameId || groupData.classNameId,
          subjectNameId: subjectNameId,
          id: { [Op.ne]: id }
        }
      });

      if (existingGroup) {
        return res.status(409).json({
          success: false,
          message: "This class-subject combination already exists"
        });
      }
    }

    // Update the group subject
    if (classNameId) groupData.classNameId = classNameId;
    if (subjectNameId) groupData.subjectNameId = subjectNameId;
    
    await groupData.save();

    // Get updated data with details
    const classData = await Class.findByPk(groupData.classNameId);
    const subjectData = await Subject.findByPk(groupData.subjectNameId);

    const enhancedData = {
      id: groupData.id,
      classNameId: groupData.classNameId,
      subjectNameId: groupData.subjectNameId,
      createdAt: groupData.createdAt,
      updatedAt: groupData.updatedAt,
      class: classData ? {
        id: classData.id,
        name: classData.name,
        createdAt: classData.createdAt,
        updatedAt: classData.updatedAt
      } : null,
      subject: subjectData ? {
        id: subjectData.id,
        name: subjectData.name,
        code: subjectData.code,
        marks: subjectData.marks,
        passMarks: subjectData.passMarks,
        createdAt: subjectData.createdAt,
        updatedAt: subjectData.updatedAt
      } : null
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Group subject updated successfully",
      data: enhancedData
    });

  } catch (error) {
    console.error("Update group subject error:", error);
    next(error);
  }
};

// =================== DELETE GROUP SUBJECT ===================
const deleteGroupSubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if group subject exists
    const groupData = await GroupSubject.findByPk(id);

    if (!groupData) {
      return res.status(404).json({
        success: false,
        message: "Group subject not found"
      });
    }

    // Delete the group subject
    await GroupSubject.destroy({
      where: { id }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Group subject deleted successfully"
    });

  } catch (error) {
    console.error("Delete group subject error:", error);
    next(error);
  }
};

module.exports = {
  createGroupSubject,
  getAllGroupSubjects,
  getGroupSubjectById,
  updateGroupSubject,
  deleteGroupSubject,
};