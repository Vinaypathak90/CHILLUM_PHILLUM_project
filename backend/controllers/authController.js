require('dotenv').config(); // 🔥 Ensure .env is read properly
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin'); 
const User = require('../models/User');   
const OTP = require('../models/OTP');     
const adminFirebase = require('../config/firebaseAdmin'); 
require('dns').setDefaultResultOrder('ipv4first');
// ============================================================================
// 🔥 1. ADMIN AUTHENTICATION (UNTOUCHED) 🔥
// ============================================================================

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            const accessToken = jwt.sign(
                { id: admin._id }, 
                process.env.JWT_ACCESS_SECRET, 
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { id: admin._id }, 
                process.env.JWT_REFRESH_SECRET, 
                { expiresIn: '7d' }
            );

            res.cookie('jwt_refresh', refreshToken, {
                httpOnly: true, 
                secure: true, 
                sameSite: 'None', 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            res.status(200).json({
                success: true,
                message: 'Login successful!',
                _id: admin.id,
                email: admin.email,
                accessToken: accessToken, 
            });
            
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('🔥 Admin Login Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
};

const refreshAdmin = (req, res) => {
    try {
        const refreshToken = req.cookies?.jwt_refresh;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Unauthorized, no refresh token found' });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                console.error('🔥 Refresh Token Error:', err.message);
                return res.status(403).json({ success: false, message: 'Forbidden, token expired or invalid' });
            }

            const newAccessToken = jwt.sign(
                { id: decoded.id }, 
                process.env.JWT_ACCESS_SECRET, 
                { expiresIn: '15m' }
            );

            res.status(200).json({ success: true, accessToken: newAccessToken });
        });
    } catch (error) {
        console.error('🔥 Refresh Token Server Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error during token refresh' });
    }
};

const logoutAdmin = (req, res) => {
    try {
        res.clearCookie('jwt_refresh', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('🔥 Logout Error:', error.message);
        res.status(500).json({ success: false, message: 'Error during logout' });
    }
};


// ============================================================================
// 🔥 2. USER/MEMBER AUTHENTICATION & OTP FLOW 🔥
// ============================================================================

// ─── HELPER: Send OTP via Email ───
const sendOTPEmail = async (email, otpCode) => {
    // 🚨 DEBUGGING LOGS FOR RENDER
    console.log("\n-----------------------------------------");
    console.log("📧 Attempting to send OTP to:", email);
    console.log("🔑 Checking Env -> EMAIL_USER:", process.env.EMAIL_USER ? "LOADED ✅" : "MISSING ❌");
    console.log("🔑 Checking Env -> EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED ✅" : "MISSING ❌");
    console.log("-----------------------------------------\n");

    try {
       const transporter = nodemailer.createTransport({
            service: 'gmail', // Double safety
            
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'

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
        console.log(`✅ Email sent successfully to: ${email}`);
    } catch (error) {
        console.error("❌ NODEMAILER CRASH ERROR:", error.message);
        throw error; // Re-throw to be caught by the calling function
    }
};

// ─── HELPER: Generate Tokens & Set Cookie for Users ───
const sendUserTokenResponse = (user, statusCode, res, message) => {
    try {
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
    } catch (error) {
        console.error("🔥 Token Generation Error:", error.message);
        res.status(500).json({ success: false, message: 'Error generating auth tokens' });
    }
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
        console.error('🔥 User Login Error:', error.message);
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
        console.error("🔥 Signup OTP Request Failed:", error.message);
        res.status(500).json({ success: false, message: "Error sending OTP. Please try again.", error: error.message });
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

        sendUserTokenResponse(newUser, 201, res, "Account created successfully");
    } catch (error) {
        console.error("🔥 OTP Verification Error:", error.message);
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
        console.error("🔥 Forgot Password OTP Failed:", error.message);
        res.status(500).json({ success: false, message: "Error sending reset OTP", error: error.message });
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
        console.error("🔥 Reset Password Error:", error.message);
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
};


// ─── F. GOOGLE LOGIN (Firebase Integration) ───
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body; 

        if (!token) return res.status(400).json({ success: false, message: "Token is required" });

        const decodedToken = await adminFirebase.auth().verifyIdToken(token);
        const { email, name, picture, uid } = decodedToken;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name || 'Google User',
                email: email,
                password: uid, 
                profilePic: picture,
                authProvider: 'google'
            });
        }

        sendUserTokenResponse(user, 200, res, "Google Login Successful");
    } catch (error) {
        console.error("🔥 Google Auth Error:", error.message);
        res.status(401).json({ success: false, message: "Invalid or expired Google Token" });
    }
};

module.exports = {
    loginAdmin,
    refreshAdmin,
    logoutAdmin,
    loginUser,
    requestSignupOTP,
    verifySignupOTP,
    requestForgotPasswordOTP,
    resetPassword,
    googleLogin
};