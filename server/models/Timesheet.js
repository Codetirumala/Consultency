const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  week: {
    type: Date,
    required: true,
  },
  hours: {
    monday: { type: Number, default: 0 },
    tuesday: { type: Number, default: 0 },
    wednesday: { type: Number, default: 0 },
    thursday: { type: Number, default: 0 },
    friday: { type: Number, default: 0 },
    saturday: { type: Number, default: 0 },
    sunday: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['submitted', 'inProgress', 'approved'],
    default: 'submitted',
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Timesheet', timesheetSchema);