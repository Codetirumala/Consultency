const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Predefined CEO credentials
const CEO_EMAIL = 'ceo@company.com';
const CEO_PASSWORD = 'CEO@123456';

// Initialize CEO account
const initializeCEO = async () => {
  try {
    const existingCEO = await User.findOne({ email: CEO_EMAIL });
    if (!existingCEO) {
      const hashedPassword = await bcrypt.hash(CEO_PASSWORD, 10);
      const ceo = new User({
        name: 'CEO',
        email: CEO_EMAIL,
        password: hashedPassword,
        role: 'ceo',
        access: 'active'
      });
      await ceo.save();
      console.log('CEO account initialized');
    }
  } catch (error) {
    console.error('Error initializing CEO account:', error);
  }
};

// Call initializeCEO when the server starts
initializeCEO();

// Universal Login (CEO, Employee, Client)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.access === 'inactive') {
      return res.status(401).json({ message: 'Your account has been deactivated. Please contact the administrator.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT with role
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data based on role
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      access: user.access
    };

    // Add role-specific data
    if (user.role === 'employee') {
      userData.department = user.department;
      userData.position = user.position;
      userData.skills = user.skills;
    } else if (user.role === 'client') {
      userData.companyDetails = user.companyDetails;
    }

    res.json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
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
      password: hashedPassword,
      role: role || 'employee',
      access: 'active'
    });

    await user.save();
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 