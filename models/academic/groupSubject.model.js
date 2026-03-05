const { DataTypes } = require("sequelize");
const sequelize = require("../../database/connection");

const GroupSubject = sequelize.define("groupSubjects", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  classNameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Class ID cannot be empty"
      }
    }
  },
  subjectNameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Subject ID cannot be empty"
      }
    }
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = GroupSubject;