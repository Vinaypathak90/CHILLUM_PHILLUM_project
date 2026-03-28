const Team = require('../models/Team');

// @desc    Get all team members (Sorted by 'order')
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res) => {
    try {
        const team = await Team.find().sort({ order: 1 });
        res.status(200).json({
            success: true,
            count: team.length,
            data: team
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a new team member
// @route   POST /api/team
// @access  Private (Admin Only)
const addTeamMember = async (req, res) => {
    try {
        const member = await Team.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Team member added successfully',
            data: member
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a team member's details
// @route   PUT /api/team/:id
// @access  Private (Admin Only)
const updateTeamMember = async (req, res) => {
    try {
        let member = await Team.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        member = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Team member updated successfully',
            data: member
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Remove a team member
// @route   DELETE /api/team/:id
// @access  Private (Admin Only)
const deleteTeamMember = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        await member.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Team member removed successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
};