const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validatePasswordStrength, isPasswordExpired, checkPasswordReuse } = require('../utils/passwordUtils');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '10d' });
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!validatePasswordStrength(password)) {
      return res.status(400).json({ message: 'Password is too weak.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      passwordChangedAt: new Date(),
      passwordHistory: [hashedPassword]
    });

    res.status(201).json({ message: 'User created.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.accountLocked) {
      return res.status(403).json({ message: 'Account locked after 3 failed attempts.' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) {
        user.accountLocked = true;
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (isPasswordExpired(user.passwordChangedAt)) {
      return res.status(403).json({ message: 'Password expired. Please change your password.' });
    }

    user.failedLoginAttempts = 0;
    await user.save();

    const token = generateToken(user.id);

    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Old password is incorrect.' });

    if (!validatePasswordStrength(newPassword)) {
      return res.status(400).json({ message: 'New password is too weak.' });
    }

    const isReused = await checkPasswordReuse(newPassword, user.passwordHistory);
    if (isReused) {
      return res.status(400).json({ message: 'Cannot reuse last 3 passwords.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    let updatedHistory = [hashedNewPassword, ...user.passwordHistory];
    if (updatedHistory.length > 3) {
      updatedHistory = updatedHistory.slice(0, 3);
    }

    user.password = hashedNewPassword;
    user.passwordChangedAt = new Date();
    user.passwordHistory = updatedHistory;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
