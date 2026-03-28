const express = require('express');
const router = express.Router();
const { 
    getTeamMembers, 
    addTeamMember, 
    updateTeamMember, 
    deleteTeamMember 
} = require('../controllers/TeamController');


// Route: /api/team
router.route('/')
    .get(getTeamMembers) // Public view
    .post(addTeamMember); // Admin action

router.route('/:id')
    .put(updateTeamMember)
    .delete(deleteTeamMember);

module.exports = router;
