const Campaign = require('../models/Campaign');
// ============================================================================
//   @desc    Get all campaigns (Sorted by 'order')
//    @route   GET /api/campaigns
// @access  Public
// ============================================================================
const getCampaigns = async (req, res) => {
    try {
        // By default, we only show 'published' campaigns to the public
        const campaigns = await Campaign.find({ isPublished: true }).sort({ order: 1 });
        
        res.status(200).json({
            success: true,
            count: campaigns.length,
            data: campaigns
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ============================================================================
// @desc    Create a new campaign/news update
// @route   POST /api/campaigns
// @access  Private (Admin Only)
// ============================================================================
const createCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Campaign created successfully',
            data: campaign
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// ============================================================================
// @desc    Update a campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Admin Only)
// ============================================================================
const updateCampaign = async (req, res) => {
    try {
        let campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Campaign updated successfully',
            data: campaign
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// ============================================================================
// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Admin Only)
// ============================================================================
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        await campaign.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign
};