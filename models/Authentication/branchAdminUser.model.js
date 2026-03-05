const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const BranchUser = sequelize.define("branch_users", {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: dt.STRING,
    allowNull: false,
  },
  branchId: {
    type: dt.INTEGER,
    allowNull: false,
    references: {
      model: 'branches', // Reference to branches table
      key: 'id'
    }
  },
  phone: {
    type: dt.STRING,
    allowNull: false,
    unique: true, // Phone should be unique
  },
  email: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: dt.STRING,
    allowNull: false,
  },
  status: {
    type: dt.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive']]
    }
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = BranchUser;