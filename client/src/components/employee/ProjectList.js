import React from 'react';

const ProjectList = ({ projects }) => {
  if (!projects.length) {
    return <p>No projects assigned yet.</p>;
  }

  return (
    <div className="project-list">
      {projects.map(project => (
        <div key={project._id} className="project-card">
          <h3>{project.name}</h3>
          <div className="project-details">
            <p><strong>Client:</strong> {project.client.name}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Timeline:</strong> {new Date(project.timeline.startDate).toLocaleDateString()} - {new Date(project.timeline.endDate).toLocaleDateString()}</p>
            <p><strong>Team Members:</strong></p>
            <ul>
              {project.assignedEmployees.map(employee => (
                <li key={employee._id}>{employee.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList; 