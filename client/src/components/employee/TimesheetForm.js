import React, { useState } from 'react';

const TimesheetForm = ({ projects, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    week: '',
    hours: {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'projectId' || name === 'week') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        hours: {
          ...prev.hours,
          [name]: parseInt(value) || 0
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      projectId: '',
      week: '',
      hours: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="timesheet-form">
      <div className="form-group">
        <label>Project:</label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          required
        >
          <option value="">Select Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Week:</label>
        <input
          type="date"
          name="week"
          value={formData.week}
          onChange={handleChange}
          required
        />
      </div>

      <div className="hours-grid">
        {Object.keys(formData.hours).map(day => (
          <div key={day} className="form-group">
            <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
            <input
              type="number"
              name={day}
              value={formData.hours[day]}
              onChange={handleChange}
              min="0"
              max="24"
              required
            />
          </div>
        ))}
      </div>

      <button type="submit" className="submit-button">Submit Timesheet</button>
    </form>
  );
};

export default TimesheetForm; 