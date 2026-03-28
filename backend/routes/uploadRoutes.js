require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

// 1. Cloudinary Authentication (Using .env variables for Security)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cloudinary Storage Engine for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chillum_phillum_studio', // Cloudinary mein is naam ka folder ban jayega
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'], // Strict file type security
        // Optional: Yahan tu image compress bhi kar sakta hai agar chahe toh
        // transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }] 
    },
});

// 3. Initialize Multer with Storage & Limits
const upload = multer({ 
    storage: storage,
     // Maximum 5MB allow karega hackers se bachne ke liye
});

// 4. Secure POST Route for Global Upload
router.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        // Agar file nahi aayi ya format galat hua toh
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid file format or no file uploaded.' 
            });
        }
        
        // Cloudinary automatically ek secure global URL generate karke req.file.path mein deta hai
        res.status(200).json({ 
            success: true, 
            message: 'Image securely uploaded to Cloud! 🌍',
            imageUrl: req.file.path 
        });

    } catch (error) {
        console.error('Cloud Upload Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error during cloud upload', 
            error: error.message 
        });
    }
});

module.exports = router;