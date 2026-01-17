const { DataTypes } = require("sequelize");
const sequelize = require("../../database/connection");

const Teacher = sequelize.define("teachers", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Basic Info
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },

  designation: { type: DataTypes.STRING, allowNull: false },
  nid: { type: DataTypes.STRING, allowNull: true },

  gender: { type: DataTypes.STRING, allowNull: false },
  religion: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.STRING, allowNull: false },

  bloodGroup: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: false },

  // Education Info
  universityName: { type: DataTypes.STRING, allowNull: false },
  qualification: { type: DataTypes.STRING, allowNull: false },
  specialistSubject: { type: DataTypes.STRING, allowNull: false },

  universityStartDate: { type: DataTypes.STRING, allowNull: false },
  universityEndDate: { type: DataTypes.STRING, allowNull: false },

  avatar: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Teacher;
