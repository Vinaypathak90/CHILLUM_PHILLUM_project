const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 1. Load Environment Variables (Sabse pehle load karna zaroori hai)
dotenv.config();

// Ab config load hone ke baad DB import karenge
const connectDB = require('./config/db');

// 2. Connect to MongoDB
connectDB();

// 3. Initialize Express App
const app = express();

// 4. Global Middlewares
// CORS setup: Frontend aur Backend alag ports par hote hain, isliye ye zaroori hai
app.use(cors({
    origin: '*', // Jab website live hogi, toh '*' ki jagah hum exact frontend URL daalenge security ke liye
    credentials: true
}));

// Body parsers: Jo data frontend se aayega (text, json) usko read karne ke liye
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 5. Default Route (API Check)
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Chillum Phillum CMS API 🎬',
        status: 'Active'
    });
});

// 6. 🚀 Main API Routes 
app.use('/api/auth', require('./routes/authRoutes')); // 🔐 Admin Login aur Auth ke liye
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/page-content', require('./routes/pageContentRoutes')); 



// 7. 404 Route Handler (Agar koi aisi API hit kare jo exist nahi karti)
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
    console.log(`🔥 Server is running in ${ENV} mode on http://localhost:${PORT}`);
});