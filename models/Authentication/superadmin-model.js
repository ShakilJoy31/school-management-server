const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const SuperAdmin = sequelize.define("superadmins", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: dt.STRING,
    allowNull: false,
  },
  email: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNumber: {
    type: dt.STRING,
    allowNull: false,
  },
  photo: {
    type: dt.STRING,
    allowNull: true,
  },
  password: {
    type: dt.STRING,
    allowNull: false,
  },
  role: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "super-admin",
  },
  status: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
});

module.exports = SuperAdmin;
