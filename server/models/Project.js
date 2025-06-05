const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedEmployees: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['lead', 'developer', 'designer', 'tester'],
      default: 'developer'
    }
  }],
  timeline: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    milestones: [{
      name: String,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'completed', 'delayed'],
        default: 'pending'
      }
    }]
  },
  status: {
    type: String,
    enum: ['ongoing', 'hold', 'completed'],
    default: 'ongoing',
  },
  budget: {
    type: Number,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);