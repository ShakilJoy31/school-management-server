const { DataTypes } = require("sequelize");
const sequelize = require("../../database/connection");

const Student = sequelize.define("students", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sessionYearId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Student name cannot be empty"
      }
    }
  },
  phone: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [11, 11],
        msg: "Phone number must be exactly 11 digits"
      },
      isNumeric: {
        msg: "Phone number must contain only digits"
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: {
        msg: "Must be a valid email address"
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classNameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  classRoll: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sectionNameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  streamNameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  religion: {
    type: DataTypes.ENUM('Islam', 'Hindu', 'Christian', 'Other'),
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  bloodGroup: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fatherName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motherName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentPhone: {
    type: DataTypes.STRING(11),
    allowNull: false,
    validate: {
      len: {
        args: [11, 11],
        msg: "Parent phone number must be exactly 11 digits"
      },
      isNumeric: {
        msg: "Parent phone number must contain only digits"
      }
    }
  },
  subjects: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidArray(value) {
        if (!Array.isArray(value)) {
          throw new Error("Subjects must be an array");
        }
        if (value.length === 0) {
          throw new Error("At least one subject must be selected");
        }
      }
    }
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Student;