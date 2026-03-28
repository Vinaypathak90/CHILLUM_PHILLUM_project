const express = require('express');
const router = express.Router();
const { 
    getCampaigns, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign 
} = require('../controllers/campaignController');

// Route: /api/campaigns
router.route('/')
    .get(getCampaigns)   // Public news feed
    .post(createCampaign); // Admin post news

// Route: /api/campaigns/:id
router.route('/:id')
    .put(updateCampaign)
    .delete(deleteCampaign);

module.exports = router;
