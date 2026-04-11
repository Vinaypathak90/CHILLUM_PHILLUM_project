const PageContent = require('../models/PageContent');
// ============================================================================
// @desc    Get all global page content
// @route   GET /api/page-content
// @access  Public
// ============================================================================
const getPageContent = async (req, res) => {
    try {
        // We use findOne because there should only be one settings document
        let content = await PageContent.findOne();

        // If no content exists yet, return an empty object or default structure
        if (!content) {
            return res.status(200).json({
                success: true,
                message: 'No content found. Please update via Admin Panel.',
                data: {}
            });
        }

        res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ============================================================================
// @desc    Update or Initialize global page content
// @route   POST /api/page-content
// @access  Private (Admin Only)
// ============================================================================
const updatePageContent = async (req, res) => {
    try {
        let content = await PageContent.findOne();

        if (content) {
            // Update existing document - use $set to merge data properly
            content = await PageContent.findOneAndUpdate(
                {},
                { $set: req.body },
                {
                    new: true,
                    runValidators: true,
                    upsert: false
                }
            );
        } else {
            // Create the first document if it doesn't exist
            content = await PageContent.create(req.body);
        }

        res.status(200).json({
            success: true,
            message: 'Website content updated successfully!',
            data: content
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getPageContent,
    updatePageContent
};