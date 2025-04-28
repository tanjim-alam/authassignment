const bcrypt = require('bcrypt');

const validatePasswordStrength = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%]).{8,}$/;
  return regex.test(password);
};

const isPasswordExpired = (passwordChangedAt) => {
  if (!passwordChangedAt) return true;
  const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
  return (new Date() - new Date(passwordChangedAt)) > TEN_DAYS;
};

const checkPasswordReuse = async (newPassword, passwordHistory) => {
  for (let oldPasswordHash of passwordHistory) {
    const match = await bcrypt.compare(newPassword, oldPasswordHash);
    if (match) return true;
  }
  return false;
};

module.exports = { validatePasswordStrength, isPasswordExpired, checkPasswordReuse };
