const Project = require('../models/Project');
// ============================================================================
// @desc    Get all projects (Ordered by the 'order' field)
// @route   GET /api/projects
// @access  Public
// ============================================================================
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1 });
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ============================================================================
// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin Only - Auth middleware will be added later)
// ============================================================================
const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ============================================================================
// @desc    Update an existing project
// @route   PUT /api/projects/:id
// @access  Private (Admin Only)
// ============================================================================
const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin Only)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject
};
