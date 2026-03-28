const express = require('express');
const router = express.Router();
const { 
    getProjects, 
    createProject, 
    updateProject, 
    deleteProject 
} = require('../controllers/projectController');

// Route: /api/projects
router.route('/')
    .get(getProjects)   // Get all projects for homepage
    .post(createProject); // Add new project from Admin

// Route: /api/projects/:id
router.route('/:id')
    .put(updateProject)    // Update specific project
    .delete(deleteProject); // Delete specific project

module.exports = router;
