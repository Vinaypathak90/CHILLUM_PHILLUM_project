const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Tera Admin model ka path

const protect = async (req, res, next) => {
    let token;

    // 1. Check karo ki headers me authorization bearer token hai kya
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Token extract karo -> "Bearer [token]" me se sirf token nikalo
            token = req.headers.authorization.split(' ')[1];

            // 3. Token verify karo (🔥 Dhyan de: Yahan JWT_ACCESS_SECRET use hoga)
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            // 4. Admin ka data request me add kar do (password chhod kar)
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
            }

            // Sab theek hai, aage badhne do
            next(); 

        } catch (error) {
            console.error('Token Verification Error:', error.message);
            
            // 🔥 SUPER IMPORTANT FOR REFRESH TOKEN FLOW:
            // Agar token sirf expire hua hai, toh 403 bhejo taaki frontend chup-chaap refresh API call kar le
            if (error.name === 'TokenExpiredError') {
                return res.status(403).json({ success: false, message: 'Forbidden: Access Token Expired' });
            }

            // Agar token galat hai ya kisi ne chhed-chhad ki hai
            return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
        }
    }

    // Agar header mein token aaya hi nahi
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };