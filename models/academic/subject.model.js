const { DataTypes:dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Subject = sequelize.define("subjects", {
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
        msg: "Subject name cannot be empty"
      }
    }
  },
  code: {
    type: dt.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Subject code cannot be empty"
      }
    }
  },
  marks: {
    type: dt.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: "Marks must be an integer"
      },
      min: {
        args: [0],
        msg: "Marks cannot be negative"
      }
    }
  },
  passMarks: {
    type: dt.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: "Pass marks must be an integer"
      },
      min: {
        args: [0],
        msg: "Pass marks cannot be negative"
      },
      isLessThanOrEqualToMarks(value) {
        if (value > this.marks) {
          throw new Error("Pass marks cannot be greater than total marks");
        }
      }
    }
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Subject;