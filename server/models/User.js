const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ceo', 'employee', 'client'],
    required: true,
  },
  contact: {
    type: String,
  },
  skills: {
    type: [String],
  },
  companyDetails: {
    type: Object,
  },
  projectAssignments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Project',
  },
  access: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

module.exports = mongoose.model('User', userSchema); 