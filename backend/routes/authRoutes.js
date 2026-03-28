const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');

// Route: POST /api/auth/login
// Public route (kyunki login karne ke liye pehle se token nahi ho sakta)
router.post('/login', loginAdmin);

module.exports = router;