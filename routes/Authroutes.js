const express = require('express');
const router = express.Router();
const { login, register, forgotPassword, resetPassword } = require('../controller/Authcontroller'); // corrected function name
const { loginValidation, registerValidation, validate } = require('../validators/Validation');

// Login route
router.post('/login', loginValidation, validate, login);

// Register route
router.post('/register', registerValidation, validate, register);

// Forgot Password route
router.post('/forgot', forgotPassword);

// Reset Password route
router.patch('/reset', resetPassword); // corrected function name

module.exports = router;
