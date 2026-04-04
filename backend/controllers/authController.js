const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin'); // Tera Admin model
const User = require('../models/User');   // Naya User/Member model
const OTP = require('../models/OTP');     // OTP model
const adminFirebase = require('../config/firebaseAdmin'); // Firebase Setup

// ============================================================================
// 🔥 1. OLD CODE: ADMIN AUTHENTICATION (UNTOUCHED) 🔥
// ============================================================================

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


// ============================================================================
// 🔥 2. NEW FEATURES: USER/MEMBER AUTHENTICATION & OTP FLOW 🔥
// ============================================================================

// ─── HELPER: Send OTP via Email ───
const sendOTPEmail = async (email, otpCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Chillum Phillum - Security Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <h2 style="color: #292e91; text-align: center;">Chillum Phillum</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">Your verification code is:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #b5862a;">${otpCode}</span>
                </div>
                <p style="font-size: 14px; color: #888; text-align: center;">This code will expire in 5 minutes. Do not share it with anyone.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

// ─── HELPER: Generate Tokens & Set Cookie for Users ───
const sendUserTokenResponse = (user, statusCode, res, message) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('jwt_refresh', refreshToken, {
        httpOnly: true, secure: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(statusCode).json({
        success: true,
        message,
        accessToken,
        user: { name: user.name, email: user.email }
    });
};


// ─── A. USER LOGIN (Standard Email/Password) ───
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        sendUserTokenResponse(user, 200, res, "Login successful!");
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};


// ─── B. SIGNUP OTP REQUEST ───
const requestSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) return res.status(400).json({ success: false, message: "Email is already registered. Please sign in." });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.findOneAndDelete({ email }); 
        await OTP.create({ email, otp: otpCode });
        await sendOTPEmail(email, otpCode);

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending OTP" });
    }
};


// ─── C. VERIFY SIGNUP OTP & CREATE ACCOUNT ───
const verifySignupOTP = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ success: false, message: "Invalid or expired OTP!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, authProvider: 'email' });

        await OTP.deleteOne({ _id: otpRecord._id });

        // Generate tokens and set cookie securely
        sendUserTokenResponse(newUser, 201, res, "Account created successfully");
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying OTP" });
    }
};


// ─── D. REQUEST OTP FOR FORGOT PASSWORD ───
const requestForgotPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ success: false, message: "No account found with this email." });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        await OTP.findOneAndDelete({ email });
        await OTP.create({ email, otp: otpCode });
        await sendOTPEmail(email, otpCode);

        res.status(200).json({ success: true, message: "Password reset OTP sent!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending reset OTP" });
    }
};


// ─── E. VERIFY OTP & RESET PASSWORD ───
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ success: false, message: "Invalid or expired OTP!" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
};


// ─── F. GOOGLE LOGIN (Firebase Integration) ───
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body; // Firebase idToken from Frontend

        if (!token) return res.status(400).json({ success: false, message: "Token is required" });

        // Verify Firebase Token
        const decodedToken = await adminFirebase.auth().verifyIdToken(token);
        const { email, name, picture, uid } = decodedToken;

        // Check if user exists, else create
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name || 'Google User',
                email: email,
                password: uid, // Fallback password for Google users
                profilePic: picture,
                authProvider: 'google'
            });
        }

        // Generate tokens and set cookie securely
        sendUserTokenResponse(user, 200, res, "Google Login Successful");
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired Google Token" });
    }
};


// ============================================================================
// 🔥 EXPORT ALL CONTROLLERS 🔥
// ============================================================================
module.exports = {
    // Admin Routes
    loginAdmin,
    refreshAdmin,
    logoutAdmin,
    
    // User / Member Routes
    loginUser,
    requestSignupOTP,
    verifySignupOTP,
    requestForgotPasswordOTP,
    resetPassword,
    googleLogin
};