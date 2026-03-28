const express = require('express');
const router = express.Router();
const { 
    getPageContent, 
    updatePageContent 
} = require('../controllers/pageContentController');

// Route: /api/page-content
router.route('/')
    .get(getPageContent)      // Used by React to load the website data
    .post(updatePageContent); // Used by Admin to save changes

module.exports = router;
