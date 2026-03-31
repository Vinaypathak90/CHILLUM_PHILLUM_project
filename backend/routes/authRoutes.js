const express = require('express');
const router = express.Router();

// Controller se teeno functions import kar rahe hain
const { loginAdmin, refreshAdmin, logoutAdmin } = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Admin login & get tokens (Access + Refresh)
// @access  Public
router.post('/login', loginAdmin);

// @route   POST /api/auth/refresh
// @desc    Get new Access Token using HttpOnly Cookie
// @access  Public (Frontend chupke se isko call karega background mein)
router.post('/refresh', refreshAdmin);

// @route   POST /api/auth/logout
// @desc    Logout admin & clear HttpOnly cookie
// @access  Public
router.post('/logout', logoutAdmin);

module.exports = router;