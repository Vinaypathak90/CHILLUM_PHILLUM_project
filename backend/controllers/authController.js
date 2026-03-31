const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Tera Admin model ka path check kar lena

// @desc    Authenticate admin & get tokens (Access + Refresh)
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if admin exists
        const admin = await Admin.findOne({ email });

        // 2. Verify password (assuming matchPassword exists in your Admin model)
        if (admin && (await admin.matchPassword(password))) {
            
            // 3. Generate Access Token (Short life: 15 Minutes)
            // Ye token frontend har API request ke header me bhejega
            const accessToken = jwt.sign(
                { id: admin._id }, 
                process.env.JWT_ACCESS_SECRET, 
                { expiresIn: '15m' }
            );

            // 4. Generate Refresh Token (Long life: 7 Days)
            // Ye token naya Access Token laane ke kaam aayega
            const refreshToken = jwt.sign(
                { id: admin._id }, 
                process.env.JWT_REFRESH_SECRET, 
                { expiresIn: '7d' }
            );

            // 5. Set Refresh Token in HttpOnly Cookie 
            // Ye sabse secure tareeka hai, hackers isko JS se read nahi kar sakte
            res.cookie('jwt_refresh', refreshToken, {
                httpOnly: true, 
                secure: true, // true rakhna kyunki Vercel/Render dono HTTPS use karte hain
                sameSite: 'None', // Cross-origin requests ke liye zaroori (Frontend -> Backend)
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });

            // 6. Send Access Token & Admin Info in JSON
            res.status(200).json({
                success: true,
                message: 'Login successful!',
                _id: admin.id,
                email: admin.email,
                accessToken: accessToken, // Frontend isko LocalStorage/Memory me save karega
            });
            
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// @desc    Get new Access Token using Refresh Token
// @route   POST /api/auth/refresh
// @access  Public (But needs valid cookie)
const refreshAdmin = (req, res) => {
    // 1. Cookie se refresh token nikal 
    // (Agar yahan undefined aaye toh server.js me cookie-parser aur cors check karna)
    const refreshToken = req.cookies?.jwt_refresh;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized, no refresh token found' });
    }

    // 2. Verify the Refresh Token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Forbidden, token expired or invalid' });
        }

        // 3. Agar token sahi hai, toh ek naya Access Token banao
        const newAccessToken = jwt.sign(
            { id: decoded.id }, 
            process.env.JWT_ACCESS_SECRET, 
            { expiresIn: '15m' }
        );

        // 4. Send new Access Token to frontend
        res.status(200).json({ 
            success: true, 
            accessToken: newAccessToken 
        });
    });
};

// @desc    Logout Admin & clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutAdmin = (req, res) => {
    // Cookie ko clear kar do taaki refresh token ud jaye
    res.clearCookie('jwt_refresh', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
    loginAdmin,
    refreshAdmin,
    logoutAdmin
};