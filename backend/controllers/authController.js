const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// JWT Generate karne ka function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                success: true,
                _id: admin.id,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

module.exports = {
    loginAdmin,
};
