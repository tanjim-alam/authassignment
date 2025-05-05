const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const OTP = require('../models/otp');
const { validatePasswordStrength, isPasswordExpired, checkPasswordReuse } = require('../utils/passwordUtils');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

  const mailOptions = {
    from: process.env.EMAIL || "tanjim11alam@gmail.com",
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

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
      passwordHistory: [hashedPassword],
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

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // OTP expires in 3 minutes

    await OTP.create({
      userId: user.id,
      otp,
      expiresAt,
    });

    await sendOTP(user.email, otp);

    res.status(200).json({ message: 'OTP sent to email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const otpRecord = await OTP.findOne({ where: { userId: user.id, otp, isVerified: false } });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP or OTP already verified.' });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    const token = generateToken(user.id);
    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.log("err", err)
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

exports.requestNewOTP = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    await OTP.create({
      userId: user.id,
      otp,
      expiresAt,
      isVerified: false,
    });

    await sendOTP(user.email, otp);

    res.status(200).json({ message: 'New OTP sent to email.' });
  } catch (err) {
    console.error("Error requesting new OTP:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpRecord = await OTP.findOne({
      where: { userId: user.id, otp},
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP or OTP not verified.' });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    if (!validatePasswordStrength(newPassword)) {
      return res.status(400).json({ message: 'New password does not meet strength requirements.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    // console.error("Error resetting password:", err);
    res.status(500).json({ message: 'Server error' });
  }
};