const { DataTypes } = require("sequelize");
const sequelize = require("../../database/connection");

const Branch = sequelize.define("branches", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  hotline: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  principalVoice: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  vicePrincipalVoice: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  eiin: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Branch;
