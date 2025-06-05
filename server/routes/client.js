const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get client profile
router.get('/profile', auth, async (req, res) => {
  try {
    const client = await User.findById(req.user.id)
      .select('-password')
      .populate('projectAssignments');
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get client's projects
router.get('/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id })
      .populate('assignedEmployees', 'name email department position');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 