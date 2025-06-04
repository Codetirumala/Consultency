const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Timesheet = require('../models/Timesheet');
const auth = require('../middleware/auth');

// Get employee profile
router.get('/profile', auth, async (req, res) => {
  try {
    const employee = await User.findById(req.user.id)
      .select('-password')
      .populate('projectAssignments');
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get assigned projects
router.get('/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ assignedEmployees: req.user.id })
      .populate('client', 'name email companyDetails')
      .populate('assignedEmployees', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit timesheet
router.post('/timesheet', auth, async (req, res) => {
  try {
    const timesheet = new Timesheet({
      employee: req.user.id,
      project: req.body.projectId,
      week: req.body.week,
      hours: req.body.hours,
      status: 'submitted',
      manager: req.body.managerId
    });

    const newTimesheet = await timesheet.save();
    res.status(201).json(newTimesheet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get employee timesheets
router.get('/timesheets', auth, async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ employee: req.user.id })
      .populate('project', 'name')
      .populate('manager', 'name email')
      .sort({ week: -1 });
    res.json(timesheets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update timesheet
router.put('/timesheet/:id', auth, async (req, res) => {
  try {
    const timesheet = await Timesheet.findOne({
      _id: req.params.id,
      employee: req.user.id
    });

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    if (timesheet.status === 'approved') {
      return res.status(400).json({ message: 'Cannot update approved timesheet' });
    }

    timesheet.hours = req.body.hours;
    timesheet.status = 'submitted';
    
    const updatedTimesheet = await timesheet.save();
    res.json(updatedTimesheet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 