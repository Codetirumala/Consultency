import React, { useState, useEffect } from 'react';
import { FaUsers, FaBuilding, FaPlus, FaTimes, FaSignOutAlt, FaTrash, FaProjectDiagram } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import loadingAnimation from '../assets/animations/loading.json';
import Lottie from 'lottie-react';
import ProjectManagement from './ceo/ProjectManagement';

const CEODashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    position: '',
    company: ''
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);

  // Add auth token to axios requests
  axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;

  useEffect(() => {
    // Show loader for 6-7 seconds after login
    const loaderTimeout = setTimeout(() => {
      setShowLoader(false);
    }, 6500); // 6.5 seconds
    fetchData();
    return () => clearTimeout(loaderTimeout);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const notify = (message, type = 'info') => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      default:
        toast.info(message, options);
    }
  };

  const fetchData = async () => {
    try {
      const [employeesRes, clientsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/ceo/employees'),
        axios.get('http://localhost:5000/api/ceo/clients')
      ]);
      setEmployees(employeesRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 401) {
        notify('Please login again', 'error');
        handleLogout();
      } else {
        notify('Failed to fetch data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const endpoint = newUser.role === 'employee' 
        ? 'http://localhost:5000/api/ceo/employees'
        : 'http://localhost:5000/api/ceo/clients';
      
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      };

      if (newUser.role === 'employee') {
        userData.department = newUser.department;
        userData.position = newUser.position;
      } else {
        userData.companyDetails = {
          name: newUser.company
        };
      }
      
      await axios.post(endpoint, userData);
      await fetchData();
      
      notify(`${newUser.role === 'employee' ? 'Employee' : 'Client'} added successfully!`, 'success');
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        department: '',
        position: '',
        company: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.response?.status === 401) {
        notify('Please login again', 'error');
        handleLogout();
      } else {
        notify(error.response?.data?.message || 'Failed to add user', 'error');
      }
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, role) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const endpoint = role === 'employee'
        ? `http://localhost:5000/api/ceo/employees/${userId}`
        : `http://localhost:5000/api/ceo/clients/${userId}`;
      await axios.delete(endpoint);
      notify('User deleted successfully!', 'success');
      await fetchData();
    } catch (error) {
      notify('Failed to delete user', 'error');
    }
  };

  // Update access
  const handleAccessChange = async (userId, role, newAccess) => {
    try {
      const endpoint = role === 'employee'
        ? `http://localhost:5000/api/ceo/employees/${userId}`
        : `http://localhost:5000/api/ceo/clients/${userId}`;
      await axios.put(endpoint, { access: newAccess });
      notify('Access updated!', 'success');
      await fetchData();
    } catch (error) {
      notify('Failed to update access', 'error');
    }
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
    <div className="ceo-dashboard">
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
        <div className="header-content">
          <h1>Welcome, {user?.name}</h1>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-info">
              <h3>{employees.length}</h3>
              <p>Employees</p>
            </div>
          </div>
          <div className="stat-card">
            <FaBuilding className="stat-icon" />
            <div className="stat-info">
              <h3>{clients.length}</h3>
              <p>Clients</p>
            </div>
          </div>
        </div>
      </div>

     

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <FaUsers /> Employees
          </button>
          <button
            className={`tab-button ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <FaBuilding /> Clients
          </button>
          <button
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FaProjectDiagram /> Projects
          </button>
          {(activeTab === 'employees' || activeTab === 'clients') && (
            <button
              className="tab-button add-button"
              onClick={() => {
                setNewUser({
                  name: '',
                  email: '',
                  password: '',
                  role: activeTab === 'clients' ? 'client' : 'employee',
                  department: '',
                  position: '',
                  company: ''
                });
                setShowAddModal(true);
              }}
            >
              <FaPlus /> Add {activeTab === 'employees' ? 'Employee' : 'Client'}
            </button>
          )}
        </div>

        <div className="users-list">
          {activeTab === 'employees' ? (
            <div>
              <h2>Employees</h2>
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Skills</th>
                      <th>Status</th>
                      <th>Projects</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(employee => (
                      <tr key={employee._id}>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.contact || '-'}</td>
                        <td>{employee.department || '-'}</td>
                        <td>{employee.position || '-'}</td>
                        <td>
                          {employee.skills && employee.skills.length > 0 
                            ? employee.skills.join(', ') 
                            : '-'}
                        </td>
                        <td>
                          <select
                            className={`status-badge ${employee.access}`}
                            value={employee.access || 'active'}
                            onChange={e => handleAccessChange(employee._id, 'employee', e.target.value)}
                          >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                          </select>
                        </td>
                        <td>
                          {employee.projectAssignments && employee.projectAssignments.length > 0 
                            ? employee.projectAssignments.length 
                            : '0'}
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => handleDeleteUser(employee._id, 'employee')} title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'clients' ? (
            <div>
              <h2>Clients</h2>
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Projects</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client._id}>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.contact || '-'}</td>
                        <td>{client.companyDetails?.name || '-'}</td>
                        <td>
                          <select
                            className={`status-badge ${client.access}`}
                            value={client.access || 'active'}
                            onChange={e => handleAccessChange(client._id, 'client', e.target.value)}
                          >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                          </select>
                        </td>
                        <td>
                          {client.projectAssignments && client.projectAssignments.length > 0 
                            ? client.projectAssignments.length 
                            : '0'}
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => handleDeleteUser(client._id, 'client')} title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'projects' ? (
            <ProjectManagement />
          ) : null}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowAddModal(false)}>
              <FaTimes />
            </button>
            <h2>Add {newUser.role === 'employee' ? 'Employee' : 'Client'}</h2>
            <form onSubmit={handleAddUser} className="add-user-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              {newUser.role === 'employee' ? (
                <>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={newUser.position}
                      onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={newUser.company}
                    onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                    required
                  />
                </div>
              )}
              <button type="submit" className="submit-button">
                Add {newUser.role === 'employee' ? 'Employee' : 'Client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CEODashboard;