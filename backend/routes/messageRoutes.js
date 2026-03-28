const express = require('express');
const router = express.Router();

// Saare functions ko controller se import kiya
const { 
    sendMessage, 
    getAllMessages, 
    updateMessageStatus, 
    deleteMessage 
} = require('../controllers/messageController');

// const { protect } = require('../middleware/authMiddleware');

// Public route to send a message (Contact Form)
router.post('/', sendMessage);

// Private route to get all messages (Admin Only)
router.get('/', getAllMessages);

// 🔥 NAYE ROUTES: Mark as Read (PUT) aur Delete (DELETE) karne ke liye
router.put('/:id', updateMessageStatus);
router.delete('/:id', deleteMessage);

module.exports = router;