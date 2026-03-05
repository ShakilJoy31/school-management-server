const { Op } = require("sequelize");
const Stream = require("../../models/academic/stream.model");

// =================== CREATE STREAM ===================
const createStream = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Stream name is required"
      });
    }

    // Check if stream with this name already exists
    const existingStream = await Stream.findOne({ 
      where: { 
        name: name.trim()
      } 
    });
    
    if (existingStream) {
      return res.status(409).json({
        success: false,
        message: "Stream with this name already exists"
      });
    }

    // Create the stream
    const newStream = await Stream.create({
      name: name.trim()
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Stream created successfully",
      data: newStream
    });

  } catch (error) {
    console.error("Create stream error:", error);
    next(error);
  }
};

// =================== GET ALL STREAMS (Paginated) ===================
const getAllStreams = async (req, res, next) => {
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

    const { count, rows } = await Stream.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Streams retrieved successfully",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all streams error:", error);
    next(error);
  }
};

// =================== GET STREAM BY ID ===================
const getStreamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const streamData = await Stream.findByPk(id);

    if (!streamData) {
      return res.status(404).json({
        success: false,
        message: "Stream not found"
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Stream retrieved successfully",
      data: streamData
    });

  } catch (error) {
    console.error("Get stream by id error:", error);
    next(error);
  }
};

// =================== UPDATE STREAM ===================
const updateStream = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if stream exists
    const streamData = await Stream.findByPk(id);
    if (!streamData) {
      return res.status(404).json({
        success: false,
        message: "Stream not found"
      });
    }

    // If updating name, check if it's already taken
    if (name && name.trim() !== streamData.name) {
      const nameExists = await Stream.findOne({
        where: {
          name: name.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: "Stream with this name already exists"
        });
      }
    }

    // Update the stream
    if (name) {
      streamData.name = name.trim();
      await streamData.save();
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Stream updated successfully",
      data: streamData
    });

  } catch (error) {
    console.error("Update stream error:", error);
    next(error);
  }
};

// =================== DELETE STREAM ===================
const deleteStream = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if stream exists
    const streamData = await Stream.findByPk(id);
    if (!streamData) {
      return res.status(404).json({
        success: false,
        message: "Stream not found"
      });
    }

    // Delete the stream
    await Stream.destroy({
      where: { id }
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Stream deleted successfully"
    });

  } catch (error) {
    console.error("Delete stream error:", error);
    next(error);
  }
};

module.exports = {
  createStream,
  getAllStreams,
  getStreamById,
  updateStream,
  deleteStream,
};