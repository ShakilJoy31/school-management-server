const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Stream = sequelize.define("streams", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Stream name cannot be empty"
      }
    }
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Stream;