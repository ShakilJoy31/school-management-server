const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Section = sequelize.define("sections", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: dt.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Section name cannot be empty"
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
      fields: ['name'] // Combined unique constraint
    }
  ]
});

module.exports = Section;