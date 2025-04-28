const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  failedLoginAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  accountLocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  passwordChangedAt: { type: DataTypes.DATE },
  passwordHistory: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] }
});

module.exports = User;
