const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP); 
router.post('/change-password', authController.changePassword);
router.post('/request-new-otp', authController.requestNewOTP); 
router.post('/reset-password', authController.resetPassword);

module.exports = router;
