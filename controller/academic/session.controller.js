
const { Op } = require("sequelize");
const Session = require("../../models/academic/session.model");

// =================== CREATE SESSION ===================
const createSession = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Session name is required"
      });
    }

    // Check if session with this name already exists
    const existingSession = await Session.findOne({ 
      where: { name: name.trim() } 
    });
    
    if (existingSession) {
      return res.status(409).json({
        success: false,
        message: "Session with this name already exists"
      });
    }

    // Create the session
    const newSession = await Session.create({
      name: name.trim()
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Session created successfully",
      data: newSession
    });

  } catch (error) {
    console.error("Create session error:", error);
    next(error);
  }
};

// =================== GET ALL SESSIONS (Paginated) ===================
const getAllSessions = async (req, res, next) => {
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

    const { count, rows } = await Session.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Sessions retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all sessions error:", error);
    next(error);
  }
};

// =================== GET SESSION BY ID ===================
const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sessionData = await Session.findByPk(id);

    if (!sessionData) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Session retrieved successfully",
      data: sessionData
    });

  } catch (error) {
    console.error("Get session by id error:", error);
    next(error);
  }
};

// =================== UPDATE SESSION ===================
const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log("Update session data:", { id, name });

    // Check if session exists
    const sessionData = await Session.findByPk(id);
    if (!sessionData) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // If updating name, check if it's already taken
    if (name && name.trim() !== sessionData.name) {
      const nameExists = await Session.findOne({
        where: {
          name: name.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Session with this name already exists"
        });
      }
    }

    // Update the session
    if (name) {
      sessionData.name = name.trim();
      await sessionData.save();
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Session updated successfully",
      data: sessionData
    });

  } catch (error) {
    console.error("Update session error:", error);
    next(error);
  }
};

// =================== DELETE SESSION ===================
const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if session exists
    const sessionData = await Session.findByPk(id);
    if (!sessionData) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    // Delete the session
    await Session.destroy({
      where: { id }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Session deleted successfully"
    });

  } catch (error) {
    console.error("Delete session error:", error);
    next(error);
  }
};

module.exports = {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
};