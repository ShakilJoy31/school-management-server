const { DataTypes } = require("sequelize");
const sequelize = require("../../database/connection");

const Student = sequelize.define("students", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  sessionYearId: { type: DataTypes.INTEGER, allowNull: false },

  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },

  classNameId: { type: DataTypes.INTEGER, allowNull: false },
  classRoll: { type: DataTypes.INTEGER, allowNull: false },

  sectionNameId: { type: DataTypes.INTEGER, allowNull: false },
  streamNameId: { type: DataTypes.INTEGER, allowNull: false },

  gender: { type: DataTypes.STRING, allowNull: false },
  religion: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.STRING, allowNull: false },

  bloodGroup: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: false },

  fatherName: { type: DataTypes.STRING, allowNull: false },
  motherName: { type: DataTypes.STRING, allowNull: false },
  parentPhone: { type: DataTypes.STRING, allowNull: false },

  avatar: { type: DataTypes.STRING, allowNull: true },

  subjects: {
    type: DataTypes.JSON,  // store array of subject IDs
    allowNull: false,
  }
});

module.exports = Student;
