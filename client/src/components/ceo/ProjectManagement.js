import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaUsers, FaCalendarAlt, FaChartLine, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProjectManagement.css';
import config from '../../config';


const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    holdProjects: 0
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    clientId: '',
    assignedEmployees: [],
    timeline: {
      startDate: '',
      endDate: '',
      milestones: []
    },
    status: 'ongoing',
    budget: '',
    priority: 'medium'
  });

  // Separate function to fetch employees and clients
  const fetchEmployeesAndClients = async () => {
    try {
      const [employeesRes, clientsRes] = await Promise.all([
        axios.get(`${config.API_URL}/api/ceo/employees`),
        axios.get(`${config.API_URL}/api/ceo/clients`)
      ]);
      setEmployees(employeesRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Failed to fetch employees and clients:', error);
      toast.error('Failed to fetch employees and clients data');
    }
  };

  // Fetch projects and stats
  const fetchProjectsAndStats = async () => {
    try {
      console.log('Fetching projects and stats...');
      const [projectsRes, statsRes] = await Promise.all([
        axios.get(`${config.API_URL}/api/ceo/projects`),
        axios.get(`${config.API_URL}/api/ceo/projects/stats`)
      ]);
      
      console.log('Fetched projects:', projectsRes.data);
      console.log('Fetched stats:', statsRes.data);

      if (Array.isArray(projectsRes.data)) {
        setProjects(projectsRes.data);
      } else {
        console.error('Projects data is not an array:', projectsRes.data);
        toast.error('Invalid projects data received');
      }

      if (statsRes.data) {
        setStats(statsRes.data);
      } else {
        console.error('Stats data is invalid:', statsRes.data);
        toast.error('Invalid stats data received');
      }
    } catch (error) {
      console.error('Failed to fetch projects and stats:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
        toast.error(error.response.data.message || 'Failed to fetch projects data');
      } else {
        toast.error('Failed to fetch projects data');
      }
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchEmployeesAndClients(),
          fetchProjectsAndStats()
        ]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to fetch data');
      }
    };
    fetchAllData();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      // Format the project data according to the schema
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        clientId: newProject.clientId,
        assignedEmployees: newProject.assignedEmployees.map(emp => ({
          employee: emp.id, // always use employee
          role: emp.role || 'developer'
        })),
        startDate: newProject.timeline.startDate,
        endDate: newProject.timeline.endDate,
        budget: Number(newProject.budget),
        priority: newProject.priority,
        status: 'ongoing',
        timeline: {
          startDate: newProject.timeline.startDate,
          endDate: newProject.timeline.endDate,
          milestones: []
        }
      };

      console.log('Sending project data:', projectData);

      const response = await axios.post(`${config.API_URL}/api/ceo/projects`, projectData);
      console.log('Server response:', response.data);

      toast.success('Project added successfully!');
      setShowAddModal(false);
      setNewProject({
        name: '',
        description: '',
        clientId: '',
        assignedEmployees: [],
        timeline: {
          startDate: '',
          endDate: '',
          milestones: []
        },
        status: 'ongoing',
        budget: '',
        priority: 'medium'
      });

      // Fetch updated data
      await fetchProjectsAndStats();
    } catch (error) {
      console.error('Error adding project:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
        toast.error(error.response.data.message || 'Failed to add project');
      } else {
        toast.error('Failed to add project');
      }
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${config.API_URL}/api/ceo/projects/${selectedProject._id}`, selectedProject);
      toast.success('Project updated successfully!');
      setShowEditModal(false);
      await fetchProjectsAndStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${config.API_URL}/api/ceo/projects/${projectId}`);
      toast.success('Project deleted successfully!');
      await fetchProjectsAndStats();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="project-management">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="dashboard-header">
        
        <h1>CEO Dashboard</h1>
      </div>
      
      {/* Summary Row - Horizontal with Icons */}
      <div className="projects-summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0', padding: '1rem', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ flex: 1, textAlign: 'center', color: '#ff8800' }}>
          <FaProjectDiagram size={32} />
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalProjects || 0}</div>
          <div style={{ fontSize: 16, color: '#555', marginTop: 2 }}>Total Projects</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', color: '#ff8800' }}>
          <FaChartLine size={32} />
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.ongoingProjects || 0}</div>
          <div style={{ fontSize: 16, color: '#555', marginTop: 2 }}>Ongoing</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', color: '#ff8800' }}>
          <FaCalendarAlt size={32} />
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.completedProjects || 0}</div>
          <div style={{ fontSize: 16, color: '#555', marginTop: 2 }}>Completed</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', color: '#ff8800' }}>
          <FaUsers size={32} />
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.holdProjects || 0}</div>
          <div style={{ fontSize: 16, color: '#555', marginTop: 2 }}>On Hold</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="projects-section">
        <div className="section-header">
          <h2>Projects</h2>
          <button className="add-button" onClick={() => {
            setNewProject({
              name: '',
              description: '',
              clientId: '',
              assignedEmployees: [],
              timeline: {
                startDate: '',
                endDate: '',
                milestones: []
              },
              status: 'ongoing',
              budget: '',
              priority: 'medium'
            });
            setShowAddModal(true);
          }}>
            <FaPlus /> Add Project
          </button>
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Client</th>
                <th>Status</th>
                <th>Timeline</th>
                <th>Team</th>
                <th>Budget</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects && projects.length > 0 ? (
                projects.map(project => (
                  <tr key={project._id}>
                    <td>{project.name}</td>
                    <td>{project.description}</td>
                    <td>{project.client?.name || 'No Client'}</td>
                    <td>
                      <span className={`status-badge ${project.status}`}>{project.status}</span>
                    </td>
                    <td>
                      {project.timeline?.startDate ? new Date(project.timeline.startDate).toLocaleDateString() : 'No start date'} -
                      {project.timeline?.endDate ? new Date(project.timeline.endDate).toLocaleDateString() : 'No end date'}
                    </td>
                    <td>{project.assignedEmployees?.length || 0} members</td>
                    <td>${project.budget?.toLocaleString() || '0'}</td>
                    <td>
                      <span className={`priority-badge ${project.priority}`}>{project.priority}</span>
                    </td>
                    <td>
                      <button onClick={() => {
                        setSelectedProject(project);
                        setShowEditModal(true);
                      }} title="Edit" className="edit-btn">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteProject(project._id)} title="Delete" className="delete-btn">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>No projects found. Add a new project to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Project</h2>
            <form onSubmit={handleAddProject} className="project-form-vertical">
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Client</label>
                <select
                  value={newProject.clientId}
                  onChange={(e) => setNewProject({...newProject, clientId: e.target.value})}
                  required
                  className="styled-select"
                >
                  <option value="">Select Client</option>
                  {clients && clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.name} {client.companyDetails?.name ? `(${client.companyDetails.name})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newProject.timeline.startDate}
                    onChange={(e) => setNewProject({
                      ...newProject,
                      timeline: {
                        ...newProject.timeline,
                        startDate: e.target.value
                      }
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newProject.timeline.endDate}
                    onChange={(e) => setNewProject({
                      ...newProject,
                      timeline: {
                        ...newProject.timeline,
                        endDate: e.target.value
                      }
                    })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Budget</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                    className="styled-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  required
                  style={{ minHeight: '80px' }}
                />
              </div>
              <div className="form-group">
                <label>Team Members</label>
                <div className="checkbox-group">
                  {employees && employees.length > 0 ? (
                    employees.map(employee => (
                      <label key={employee._id} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={employee._id}
                          checked={newProject.assignedEmployees.some(emp => emp.id === employee._id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewProject({
                                ...newProject,
                                assignedEmployees: [...newProject.assignedEmployees, { id: employee._id, role: 'developer' }]
                              });
                            } else {
                              setNewProject({
                                ...newProject,
                                assignedEmployees: newProject.assignedEmployees.filter(emp => emp.id !== employee._id)
                              });
                            }
                          }}
                        />
                        {employee.name} {employee.position ? `(${employee.position}` : ''}{employee.department ? `, ${employee.department})` : employee.position ? ')' : ''}
                      </label>
                    ))
                  ) : (
                    <span>No employees available</span>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">Add Project</button>
                <button type="button" className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Project</h2>
            <form onSubmit={handleEditProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={selectedProject.name}
                  onChange={(e) => setSelectedProject({...selectedProject, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={selectedProject.description}
                  onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedProject.status}
                  onChange={(e) => setSelectedProject({...selectedProject, status: e.target.value})}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">Update Project</button>
                <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement; 