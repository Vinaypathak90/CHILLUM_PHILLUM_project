const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');

// Google DNS force karo
dns.setServers(['8.8.8.8', '8.8.4.4']);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('MongoDB Connected Successfully ✅');
  } catch (error) {
    console.error('MongoDB Connection Failed ❌', error.message);
  }
};

module.exports = connectDB;