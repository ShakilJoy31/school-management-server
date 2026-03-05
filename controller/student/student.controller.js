const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const Student = require("../../models/student/student.model");
const Class = require("../../models/academic/class.model");
const Session = require("../../models/academic/session.model");
const Section = require("../../models/academic/section.model");
const Stream = require("../../models/academic/stream.model");
const Subject = require("../../models/academic/subject.model");

// =================== CREATE STUDENT ===================
const createStudent = async (req, res, next) => {
  try {
    const {
      sessionYearId,
      name,
      phone,
      email,
      password,
      classNameId,
      classRoll,
      sectionNameId,
      streamNameId,
      gender,
      avatar,
      religion,
      dob,
      bloodGroup,
      address,
      fatherName,
      motherName,
      parentPhone,
      subjects
    } = req.body;

    // Validate required fields
    const requiredFields = {
      sessionYearId, name, phone, password, classNameId, classRoll,
      sectionNameId, streamNameId, gender, religion, dob, bloodGroup,
      address, fatherName, motherName, parentPhone, subjects
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Check if student with this phone already exists
    const existingStudentByPhone = await Student.findOne({
      where: { phone }
    });

    if (existingStudentByPhone) {
      return res.status(409).json({
        success: false,
        message: "Student with this phone number already exists"
      });
    }

    // Check if student with this email already exists (if email provided)
    if (email) {
      const existingStudentByEmail = await Student.findOne({
        where: { email }
      });

      if (existingStudentByEmail) {
        return res.status(409).json({
          success: false,
          message: "Student with this email already exists"
        });
      }
    }

    // Check if class exists
    const classExists = await Class.findByPk(classNameId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Check if session exists
    const sessionExists = await Session.findByPk(sessionYearId);
    if (!sessionExists) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Check if section exists
    const sectionExists = await Section.findByPk(sectionNameId);
    if (!sectionExists) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    // Check if stream exists
    const streamExists = await Stream.findByPk(streamNameId);
    if (!streamExists) {
      return res.status(404).json({
        success: false,
        message: "Stream not found"
      });
    }

    // Check if all subjects exist
    for (const subjectId of subjects) {
      const subjectExists = await Subject.findByPk(subjectId);
      if (!subjectExists) {
        return res.status(404).json({
          success: false,
          message: `Subject with ID ${subjectId} not found`
        });
      }
    }

    // Check if roll number already exists for this class and session
    const existingRoll = await Student.findOne({
      where: {
        classNameId,
        sessionYearId,
        classRoll
      }
    });

    if (existingRoll) {
      return res.status(409).json({
        success: false,
        message: `Roll number ${classRoll} already exists in this class for the selected session`
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the student
    const newStudent = await Student.create({
      sessionYearId,
      name: name.trim(),
      phone,
      email: email || null,
      password: hashedPassword,
      classNameId,
      classRoll,
      sectionNameId,
      streamNameId,
      gender,
      avatar: avatar || null,
      religion,
      dob,
      bloodGroup,
      address,
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      parentPhone,
      subjects: JSON.stringify(subjects) // Store as JSON string
    });

    // Remove password from response
    const studentResponse = newStudent.toJSON();
    delete studentResponse.password;

    // Get related data for response
    const classData = await Class.findByPk(classNameId);
    const sessionData = await Session.findByPk(sessionYearId);
    const sectionData = await Section.findByPk(sectionNameId);
    const streamData = await Stream.findByPk(streamNameId);

    // Get subject details and format as StudentSubject array
    const StudentSubject = [];
    for (const subjectId of subjects) {
      const subject = await Subject.findByPk(subjectId);
      if (subject) {
        StudentSubject.push({
          id: `${newStudent.id}-${subject.id}`, // Generate a unique ID
          subject: {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            marks: subject.marks,
            passMarks: subject.passMarks
          }
        });
      }
    }

    const enhancedResponse = {
      ...studentResponse,
      subjects: JSON.stringify(subjects), // Keep as string for consistency
      class: classData ? {
        id: classData.id,
        name: classData.name
      } : null,
      session: sessionData ? {
        id: sessionData.id,
        name: sessionData.name
      } : null,
      section: sectionData ? {
        id: sectionData.id,
        name: sectionData.name
      } : null,
      stream: streamData ? {
        id: streamData.id,
        name: streamData.name
      } : null,
      StudentSubject, // This matches what frontend expects
      subjectDetails: StudentSubject.map(item => item.subject) // Keep for backward compatibility
    };

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Student created successfully",
      data: enhancedResponse
    });

  } catch (error) {
    console.error("Create student error:", error);
    next(error);
  }
};

// =================== GET ALL STUDENTS (Paginated with Search) ===================
const getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, size = 10, search = '', classId, sessionId } = req.query;

    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build where condition
    const whereCondition = {};

    // Add class filter if provided
    if (classId && classId !== '0' && classId !== 0) {
      whereCondition.classNameId = classId;
    }

    // Add session filter if provided
    if (sessionId && sessionId !== '0' && sessionId !== 0) {
      whereCondition.sessionYearId = sessionId;
    }

    // Add search condition
    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { fatherName: { [Op.like]: `%${search}%` } },
        { motherName: { [Op.like]: `%${search}%` } },
        { parentPhone: { [Op.like]: `%${search}%` } }
      ];
    }

    // Get all students with pagination
    const { count, rows } = await Student.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] } // Exclude password from results
    });

    // Enhance rows with related data
    const enhancedRows = [];
    for (const row of rows) {
      const classData = await Class.findByPk(row.classNameId);
      const sessionData = await Session.findByPk(row.sessionYearId);
      const sectionData = await Section.findByPk(row.sectionNameId);
      const streamData = await Stream.findByPk(row.streamNameId);

      // Parse subjects from JSON string
      let subjectIds = [];
      try {
        subjectIds = JSON.parse(row.subjects || '[]');
      } catch (e) {
        subjectIds = [];
      }

      // Get subject details and format as StudentSubject array
      const StudentSubject = [];
      for (const subjectId of subjectIds) {
        const subject = await Subject.findByPk(subjectId);
        if (subject) {
          StudentSubject.push({
            id: `${row.id}-${subject.id}`,
            subject: {
              id: subject.id,
              name: subject.name,
              code: subject.code,
              marks: subject.marks,
              passMarks: subject.passMarks
            }
          });
        }
      }

      const rowData = row.toJSON();
      enhancedRows.push({
        ...rowData,
        class: classData ? {
          id: classData.id,
          name: classData.name
        } : null,
        session: sessionData ? {
          id: sessionData.id,
          name: sessionData.name
        } : null,
        section: sectionData ? {
          id: sectionData.id,
          name: sectionData.name
        } : null,
        stream: streamData ? {
          id: streamData.id,
          name: streamData.name
        } : null,
        StudentSubject, // This matches what frontend expects
        subjectDetails: StudentSubject.map(item => item.subject) // Keep for backward compatibility
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Students retrieved successfully",
      data: enhancedRows,
      meta: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPage: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all students error:", error);
    next(error);
  }
};

// =================== GET STUDENT BY ID ===================
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const studentData = await Student.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Get related data
    const classData = await Class.findByPk(studentData.classNameId);
    const sessionData = await Session.findByPk(studentData.sessionYearId);
    const sectionData = await Section.findByPk(studentData.sectionNameId);
    const streamData = await Stream.findByPk(studentData.streamNameId);

    // Parse subjects from JSON string
    let subjectIds = [];
    try {
      subjectIds = JSON.parse(studentData.subjects || '[]');
    } catch (e) {
      subjectIds = [];
    }

    // Get subject details and format as StudentSubject array
    const StudentSubject = [];
    for (const subjectId of subjectIds) {
      const subject = await Subject.findByPk(subjectId);
      if (subject) {
        StudentSubject.push({
          id: `${studentData.id}-${subject.id}`,
          subject: {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            marks: subject.marks,
            passMarks: subject.passMarks
          }
        });
      }
    }

    const enhancedData = {
      ...studentData.toJSON(),
      class: classData ? {
        id: classData.id,
        name: classData.name
      } : null,
      session: sessionData ? {
        id: sessionData.id,
        name: sessionData.name
      } : null,
      section: sectionData ? {
        id: sectionData.id,
        name: sectionData.name
      } : null,
      stream: streamData ? {
        id: streamData.id,
        name: streamData.name
      } : null,
      StudentSubject, // This matches what frontend expects
      subjectDetails: StudentSubject.map(item => item.subject) // Keep for backward compatibility
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Student retrieved successfully",
      data: enhancedData
    });

  } catch (error) {
    console.error("Get student by id error:", error);
    next(error);
  }
};




//! =================== UPDATE STUDENT ===================
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Check if student exists
    const studentData = await Student.findByPk(id);

    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // If updating phone, check if it's already taken
    if (updateData.phone && updateData.phone !== studentData.phone) {
      const phoneExists = await Student.findOne({
        where: {
          phone: updateData.phone,
          id: { [Op.ne]: id }
        }
      });

      if (phoneExists) {
        return res.status(409).json({
          success: false,
          message: "Student with this phone number already exists"
        });
      }
    }

    // If updating email, check if it's already taken
    if (updateData.email && updateData.email !== studentData.email) {
      const emailExists = await Student.findOne({
        where: {
          email: updateData.email,
          id: { [Op.ne]: id }
        }
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Student with this email already exists"
        });
      }
    }

    // If updating password, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // If updating classRoll, check if it's already taken in same class and session
    if (updateData.classRoll && 
        (updateData.classRoll !== studentData.classRoll || 
         updateData.classNameId || 
         updateData.sessionYearId)) {
      
      const classNameId = updateData.classNameId || studentData.classNameId;
      const sessionYearId = updateData.sessionYearId || studentData.sessionYearId;

      const rollExists = await Student.findOne({
        where: {
          classNameId,
          sessionYearId,
          classRoll: updateData.classRoll,
          id: { [Op.ne]: id }
        }
      });

      if (rollExists) {
        return res.status(409).json({
          success: false,
          message: `Roll number ${updateData.classRoll} already exists in this class for the selected session`
        });
      }
    }

    // If updating subjects, validate them
    if (updateData.subjects) {
      if (!Array.isArray(updateData.subjects) || updateData.subjects.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Subjects must be a non-empty array"
        });
      }

      for (const subjectId of updateData.subjects) {
        const subjectExists = await Subject.findByPk(subjectId);
        if (!subjectExists) {
          return res.status(404).json({
            success: false,
            message: `Subject with ID ${subjectId} not found`
          });
        }
      }
    }

    // Update the student
    await Student.update(updateData, {
      where: { id }
    });

    // Get updated student data
    const updatedStudent = await Student.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    // Get related data
    const classData = await Class.findByPk(updatedStudent.classNameId);
    const sessionData = await Session.findByPk(updatedStudent.sessionYearId);
    const sectionData = await Section.findByPk(updatedStudent.sectionNameId);
    const streamData = await Stream.findByPk(updatedStudent.streamNameId);

    // Get subject details - no need to parse, it's already an array with DataTypes.JSON
    const subjectIds = updatedStudent.subjects || [];
    
    // Get subject details and format as StudentSubject array
    const StudentSubject = [];
    for (const subjectId of subjectIds) {
      const subject = await Subject.findByPk(subjectId);
      if (subject) {
        StudentSubject.push({
          id: `${updatedStudent.id}-${subject.id}`,
          subject: {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            marks: subject.marks,
            passMarks: subject.passMarks
          }
        });
      }
    }

    const enhancedData = {
      ...updatedStudent.toJSON(),
      class: classData ? {
        id: classData.id,
        name: classData.name
      } : null,
      session: sessionData ? {
        id: sessionData.id,
        name: sessionData.name
      } : null,
      section: sectionData ? {
        id: sectionData.id,
        name: sectionData.name
      } : null,
      stream: streamData ? {
        id: streamData.id,
        name: streamData.name
      } : null,
      StudentSubject,
      subjectDetails: StudentSubject.map(item => item.subject)
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Student updated successfully",
      data: enhancedData
    });

  } catch (error) {
    console.error("Update student error:", error);
    next(error);
  }
};









//! =================== DELETE STUDENT ===================
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const studentData = await Student.findByPk(id);

    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Delete the student
    await Student.destroy({
      where: { id }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Student deleted successfully"
    });

  } catch (error) {
    console.error("Delete student error:", error);
    next(error);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};