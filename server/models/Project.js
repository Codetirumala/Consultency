const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedEmployees: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
  timeline: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['ongoing', 'hold', 'completed'],
    default: 'ongoing',
  },
});

module.exports = mongoose.model('Project', projectSchema);