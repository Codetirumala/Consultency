import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileSection = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    contact: user.contact || '',
    department: user.department || '',
    position: user.position || '',
    skills: user.skills ? user.skills.join(', ') : ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/employee/profile',
        {
          ...formData,
          skills: formData.skills.split(',').map(skill => skill.trim())
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>My Profile</h2>
        <button 
          className={`edit-button ${isEditing ? 'cancel' : ''}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>

          <button type="submit" className="submit-button">Save Changes</button>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-group">
            <label>Name:</label>
            <p>{user.name}</p>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="info-group">
            <label>Contact:</label>
            <p>{user.contact || 'Not provided'}</p>
          </div>
          <div className="info-group">
            <label>Department:</label>
            <p>{user.department || 'Not assigned'}</p>
          </div>
          <div className="info-group">
            <label>Position:</label>
            <p>{user.position || 'Not assigned'}</p>
          </div>
          <div className="info-group">
            <label>Skills:</label>
            <p>{user.skills ? user.skills.join(', ') : 'No skills listed'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection; 