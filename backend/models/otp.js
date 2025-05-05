const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OTP = sequelize.define('OTP', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  otp: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = OTP;
