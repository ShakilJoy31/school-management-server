const { DataTypes } = require("sequelize");
const sequelize = require("../../database/connection");

const Designation = sequelize.define("designations", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Designation name cannot be empty"
      },
      len: {
        args: [2, 100],
        msg: "Designation name must be between 2 and 100 characters"
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active'
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Designation;