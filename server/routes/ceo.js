const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Timesheet = require('../models/Timesheet');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// Apply auth middleware to all CEO routes
router.use(auth);

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: { $in: ['employee', 'manager'] } })
      .select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new employee
router.post('/employees', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword, // use hashed password here
      role: role || 'employee'
    });

    await user.save();
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update employee
router.put('/employees/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update access if provided
    if (req.body.access) user.access = req.body.access;
    // Optionally update other fields if needed
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.role) user.role = req.body.role;
    if (req.body.department) user.department = req.body.department;
    if (req.body.position) user.position = req.body.position;

    await user.save();
    res.json({ message: 'Access updated', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await user.deleteOne();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .select('-password');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new client
router.post('/clients', async (req, res) => {
  try {
    const { name, email, password, companyDetails } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: 'client',
      companyDetails
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ message: 'Client created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update client
router.put('/clients/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update access if provided
    if (req.body.access) user.access = req.body.access;
    // Optionally update other fields if needed
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.companyDetails) user.companyDetails = req.body.companyDetails;

    await user.save();
    res.json({ message: 'Access updated', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete client
router.delete('/clients/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('client assignedEmployees');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new project
router.post('/projects', async (req, res) => {
  const project = new Project({
    name: req.body.name,
    client: req.body.clientId,
    assignedEmployees: req.body.employeeIds,
    timeline: {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    },
    status: req.body.status,
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all timesheets
router.get('/timesheets', async (req, res) => {
  try {
    const timesheets = await Timesheet.find().populate('employee project manager');
    res.json(timesheets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/ceo/employees/:id
router.put('/employees/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update access if provided
    if (req.body.access) user.access = req.body.access;
    // Optionally update other fields if needed
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.role) user.role = req.body.role;
    if (req.body.department) user.department = req.body.department;
    if (req.body.position) user.position = req.body.position;

    await user.save();
    res.json({ message: 'Access updated', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/ceo/clients/:id
router.put('/clients/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update access if provided
    if (req.body.access) user.access = req.body.access;
    // Optionally update other fields if needed
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.companyDetails) user.companyDetails = req.body.companyDetails;

    await user.save();
    res.json({ message: 'Access updated', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 