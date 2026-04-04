const express = require('express');
const router = express.Router();

// Controller se saare functions import kar rahe hain (Admin + User)
const { 
    loginAdmin, 
    refreshAdmin, 
    logoutAdmin,
    loginUser,
    requestSignupOTP,
    verifySignupOTP,
    requestForgotPasswordOTP,
    resetPassword,
    googleLogin
} = require('../controllers/authController');

// ============================================================================
// 👑 ADMIN ROUTES (Backend CMS Access)
// ============================================================================

// @route   POST /api/auth/admin/login
// @desc    Admin login & get tokens (Access + Refresh)
// @access  Public
router.post('/admin/login', loginAdmin);

// @route   POST /api/auth/admin/refresh
// @desc    Get new Access Token using HttpOnly Cookie
// @access  Public (Frontend chupke se isko call karega background mein)
router.post('/admin/refresh', refreshAdmin);

// @route   POST /api/auth/admin/logout
// @desc    Logout admin & clear HttpOnly cookie
// @access  Public
router.post('/admin/logout', logoutAdmin);


// ============================================================================
// 👥 USER / MEMBER ROUTES (Public Website Access)
// ============================================================================

// @route   POST /api/auth/login
// @desc    User Login (Standard Email & Password)
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/request-otp
// @desc    Request OTP for new account signup
// @access  Public
router.post('/request-otp', requestSignupOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and Create User Account
// @access  Public
router.post('/verify-otp', verifySignupOTP);

// @route   POST /api/auth/forgot-password-otp
// @desc    Request OTP to reset password
// @access  Public
router.post('/forgot-password-otp', requestForgotPasswordOTP);

// @route   POST /api/auth/reset-password
// @desc    Verify OTP and set new password
// @access  Public
router.post('/reset-password', resetPassword);

// @route   POST /api/auth/google
// @desc    Login or Signup using Google Firebase Token
// @access  Public
router.post('/google', googleLogin);

module.exports = router;