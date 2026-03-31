const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// 1. Load Environment Variables (Sabse pehle load karna zaroori hai)
dotenv.config();

// 2. Connect to MongoDB
connectDB();

// 3. Initialize Express App
const app = express();

// 4. Global Middlewares
// 🔥 CORS Setup (FIXED FOR COOKIES): 
// origin '*' credentials ke sath kaam nahi karta. Exact URLs dene hote hain.
app.use(cors({
    origin: [
        'http://localhost:5173', // Local development ke liye
        'https://chillum-phillum-project.vercel.app' // Live Vercel frontend ke liye
    ],
    credentials: true // Cookie (Refresh Token) bhejne/receive karne ke liye ZAROORI hai
}));

// Body & Cookie Parsers
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Req.cookies ko padhne ke liye middleware

// 5. Default Route (API Check)
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Chillum Phillum CMS API 🎬',
        status: 'Active'
    });
});

// 6. 🚀 Main API Routes 
app.use('/api/auth', require('./routes/authRoutes'));           // Admin Login, Refresh, Logout
app.use('/api/messages', require('./routes/messageRoutes'));    // Contact Form Messages
app.use('/api/projects', require('./routes/projectRoutes'));    // Projects/Portfolio
app.use('/api/team', require('./routes/teamRoutes'));          // Team Members
app.use('/api/campaigns', require('./routes/campaignRoutes'));  // Campaigns/News
app.use('/api/page-content', require('./routes/pageContentRoutes')); // Dynamic Homepage Content

// 7. 404 Route Handler (Agar koi galat API URL hit kare)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
});

// 8. Global Error Handler (Professional way to handle crashes)
app.use((err, req, res, next) => {
    console.error(`❌ Server Error: ${err.message}`);
    
    // Sirf development phase mein error ki poori detail dikhegi
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 9. Start the Server
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    console.log(`🔥 Server is running in ${ENV} mode on port ${PORT}`);
});