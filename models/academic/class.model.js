const { DataTypes:dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Class = sequelize.define("classes", {
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
        msg: "Class name cannot be empty"
      }
    }
  },
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ]
});

module.exports = Class;