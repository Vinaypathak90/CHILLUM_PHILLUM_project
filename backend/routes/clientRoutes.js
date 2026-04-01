const express = require('express');
const router = express.Router();
const { getClients, addClient, deleteClient } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware'); // Tera naya secure middleware

router.route('/')
    .get(getClients) // Public: Homepage ke liye
    .post(protect, addClient); // Admin: Naya add karne ke liye

router.route('/:id')
    .delete(protect, deleteClient); // Admin: Delete karne ke liye

module.exports = router;
