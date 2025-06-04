import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyDetails: {
      name: '',
      address: '',
      phone: ''
    }
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/ceo/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (error) {
      setError('Failed to fetch clients');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('company.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        companyDetails: {
          ...prev.companyDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/ceo/clients/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/ceo/clients',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchClients();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save client');
    }
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name,
      email: client.email,
      companyDetails: {
        name: client.companyDetails.name,
        address: client.companyDetails.address,
        phone: client.companyDetails.phone
      }
    });
    setEditingId(client._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/ceo/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchClients();
      } catch (error) {
        setError('Failed to delete client');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      companyDetails: {
        name: '',
        address: '',
        phone: ''
      }
    });
    setEditingId(null);
  };

  return (
    <div className="management-section">
      <h2>Client Management</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="management-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {!editingId && (
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            name="company.name"
            value={formData.companyDetails.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Company Address:</label>
          <input
            type="text"
            name="company.address"
            value={formData.companyDetails.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Company Phone:</label>
          <input
            type="tel"
            name="company.phone"
            value={formData.companyDetails.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">
            {editingId ? 'Update Client' : 'Add Client'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="management-list">
        <h3>Client List</h3>
        <table className="management-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.companyDetails.name}</td>
                <td>
                  <button
                    onClick={() => handleEdit(client)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientManagement; 