import React from 'react';

const TimesheetList = ({ timesheets }) => {
  if (!timesheets.length) {
    return <p>No timesheets submitted yet.</p>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'inProgress':
        return 'status-pending';
      case 'submitted':
        return 'status-submitted';
      default:
        return '';
    }
  };

  return (
    <div className="timesheet-list">
      {timesheets.map(timesheet => (
        <div key={timesheet._id} className="timesheet-card">
          <div className="timesheet-header">
            <h3>{timesheet.project.name}</h3>
            <span className={`status ${getStatusColor(timesheet.status)}`}>
              {timesheet.status}
            </span>
          </div>
          <div className="timesheet-details">
            <p><strong>Week:</strong> {new Date(timesheet.week).toLocaleDateString()}</p>
            <p><strong>Manager:</strong> {timesheet.manager?.name || 'Not assigned'}</p>
            <div className="hours-summary">
              <h4>Hours:</h4>
              <div className="hours-grid">
                {Object.entries(timesheet.hours).map(([day, hours]) => (
                  <div key={day} className="hours-item">
                    <span>{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
              <div className="total-hours">
                <strong>Total:</strong> {Object.values(timesheet.hours).reduce((a, b) => a + b, 0)} hours
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimesheetList; 