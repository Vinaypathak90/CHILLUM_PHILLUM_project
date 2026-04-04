const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Frontend ko galti se bhi password return nahi hoga queries me
    },
    profilePic: {
        type: String,
        default: '' // Google walo ki photo aayegi yahan
    },
    authProvider: {
        type: String,
        enum: ['email', 'google'],
        default: 'email' // Pata chalega ki user ne normal signup kiya tha ya Google se
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
