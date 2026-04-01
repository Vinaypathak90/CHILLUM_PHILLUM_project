const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String, // Cloudinary ya kisi aur image host ka URL
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
