const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createSuperAdmin = async () => {
    try {
        // Apni marzi ka email aur password set kar lo
        const adminData = {
            email: 'admin@chillumphillum.com',
            password: 'SuperSecretPassword123' 
        };

        const adminExists = await Admin.findOne({ email: adminData.email });
        
        if (adminExists) {
            console.log('Admin already exists!');
            process.exit();
        }

        await Admin.create(adminData);
        console.log('✅ Admin account created successfully! You can now log in.');
        process.exit();
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createSuperAdmin();