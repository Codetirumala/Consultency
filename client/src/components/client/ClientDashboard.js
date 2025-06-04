import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Lottie from 'react-lottie';
import loadingAnimation from '../../assets/animations/loading.json';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Show loader for 6-7 seconds after login
    const loaderTimeout = setTimeout(() => {
      setShowLoader(false);
    }, 6500); // 6.5 seconds
    fetchData();
    return () => clearTimeout(loaderTimeout);
  }, []);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get('http://localhost:5000/api/client/projects', config);
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (showLoader || loading) {
    return (
      <div className="loading-container">
        <Lottie animationData={loadingAnimation} loop={true} style={{ width: 200 }} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="client-dashboard">
      <div className="dashboard-header">
        <h1>Client Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>My Projects</h2>
          <div className="projects-list">
            {projects.length === 0 ? (
              <p>No projects assigned yet.</p>
            ) : (
              projects.map(project => (
                <div key={project._id} className="project-card">
                  <h3>{project.name}</h3>
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {project.description}</p>
                  <div className="project-team">
                    <h4>Assigned Team:</h4>
                    <ul>
                      {project.assignedEmployees.map(employee => (
                        <li key={employee._id}>{employee.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Company Information</h2>
          <div className="company-info">
            <p><strong>Company Name:</strong> {user?.companyDetails?.name}</p>
            <p><strong>Address:</strong> {user?.companyDetails?.address}</p>
            <p><strong>Phone:</strong> {user?.companyDetails?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 