const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    // Check karo ki headers me authorization bearer token hai kya
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token extract karo -> "Bearer sjdhfkjsdhfksjdf"
            token = req.headers.authorization.split(' ')[1];

            // Token verify karo
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Admin ka data request me add kar do (password chhod kar)
            req.admin = await Admin.findById(decoded.id).select('-password');

            next(); // Sab theek hai, aage badhne do
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
