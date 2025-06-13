import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaProjectDiagram, FaClock, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import Lottie from 'lottie-react';
import styled from '@emotion/styled';
import TimesheetForm from './TimesheetForm';
import ProjectList from './ProjectList';
import TimesheetList from './TimesheetList';
import ProfileSection from './ProfileSection';
import './EmployeeDashboard.css';
import logo from '../../assets/logo.jpg';
import config from '../../config';
import PolygonLoader from '../PolygonLoader';

// Lottie animations
import profileAnimation from '../../assets/animations/profile.json';
import projectAnimation from '../../assets/animations/project.json';
import timesheetAnimation from '../../assets/animations/timesheet.json';
import loadingAnimation from '../../assets/animations/loading.json';

const DashboardContainer = styled(motion.div)`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--background);
  min-height: 100vh;
`;

const Header = styled(motion.div)`
  background: linear-gradient(90deg, var(--primary) 60%, var(--primary-light) 100%);
  padding: 36px 40px;
  border-radius: 20px;
  box-shadow: var(--shadow);
  margin-bottom: 32px;
  color: #fff;
`;

const TabContainer = styled(motion.div)`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  padding: 10px;
  background: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  justify-content: center;
`;

const TabButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 32px;
  background: ${props => props.active ? 'linear-gradient(90deg, var(--primary) 60%, var(--primary-light) 100%)' : '#fff'};
  color: ${props => props.active ? '#fff' : 'var(--primary)'};
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: linear-gradient(90deg, var(--primary-light) 0%, var(--primary) 100%);
    color: #fff;
    transform: translateY(-2px);
  }
`;

const ContentContainer = styled(motion.div)`
  background: #fff;
  padding: 32px 24px 24px 24px;
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  margin: 0 24px;
`;

const StatsContainer = styled(motion.div)`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  justify-content: center;
`;

const StatCard = styled(motion.div)`
  background: #fff;
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  min-height: 120px;
  justify-content: center;
  gap: 10px;
  transition: box-shadow 0.2s, transform 0.2s;
  .stat-icon {
    font-size: 2.2rem;
    color: var(--primary);
    margin-bottom: 6px;
  }
  .stat-info h3 {
    font-size: 2.1rem;
    margin: 0;
    color: var(--primary);
    font-weight: 700;
  }
  .stat-info p {
    color: var(--text-light);
    font-size: 1rem;
    margin: 0;
  }
`;

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logout, user, updateUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    setShowLoader(true);
    const loaderTimeout = setTimeout(() => {
      setShowLoader(false);
    }, 8000); // 8 seconds
    fetchData();
    return () => clearTimeout(loaderTimeout);
  }, []);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [projectsRes, timesheetsRes] = await Promise.all([
        axios.get(`${config.API_URL}/api/employee/projects`, config),
        axios.get(`${config.API_URL}/api/employee/timesheets`, config)
      ]);

      setProjects(projectsRes.data);
      setTimesheets(timesheetsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        toast.error('Please login again');
        handleLogout();
      } else {
        toast.error('Failed to fetch data');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTimesheetSubmit = async (timesheetData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${config.API_URL}/api/employee/timesheet`,
        timesheetData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTimesheets([response.data, ...timesheets]);
      toast.success('Timesheet submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit timesheet');
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    updateUser(updatedUser);
  };

  if (showLoader || loading) {
    return (
      <div className="loading-container" style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <PolygonLoader size={120} color="#ffffff" bgColor="rgb(2,174,238)" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <Header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1>Welcome back, {user?.name}!</h1>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </Header>

      <StatsContainer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StatCard whileHover={{ scale: 1.02 }}>
          <div className="stat-icon">
            <FaProjectDiagram />
          </div>
          <div className="stat-info">
            <h3>{projects.length}</h3>
            <p>Active Projects</p>
          </div>
        </StatCard>
        <StatCard whileHover={{ scale: 1.02 }}>
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{timesheets.length}</h3>
            <p>Timesheets Submitted</p>
          </div>
        </StatCard>
        <StatCard whileHover={{ scale: 1.02 }}>
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>{timesheets.filter(t => t.status === 'approved').length}</h3>
            <p>Approved Timesheets</p>
          </div>
        </StatCard>
      </StatsContainer>

      <TabContainer>
        <TabButton
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaUser /> Profile
        </TabButton>
        <TabButton
          active={activeTab === 'projects'}
          onClick={() => setActiveTab('projects')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaProjectDiagram /> Projects
        </TabButton>
        <TabButton
          active={activeTab === 'timesheet'}
          onClick={() => setActiveTab('timesheet')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaClock /> Timesheet
        </TabButton>
      </TabContainer>

      <ContentContainer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="animation-container">
                <Lottie animationData={profileAnimation} loop={true} style={{ width: 200 }} />
              </div>
              <ProfileSection user={user} onUpdate={handleProfileUpdate} />
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="animation-container">
                <Lottie animationData={projectAnimation} loop={true} style={{ width: 200 }} />
              </div>
              <div className="dashboard-section">
                <h2>My Projects</h2>
                <ProjectList projects={projects} />
              </div>
            </motion.div>
          )}

          {activeTab === 'timesheet' && (
            <motion.div
              key="timesheet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="animation-container">
                <Lottie animationData={timesheetAnimation} loop={true} style={{ width: 200 }} />
              </div>
              <div className="dashboard-section">
                <h2>Submit Timesheet</h2>
                <TimesheetForm 
                  projects={projects} 
                  onSubmit={handleTimesheetSubmit} 
                />
              </div>

              <div className="dashboard-section">
                <h2>My Timesheets</h2>
                <TimesheetList timesheets={timesheets} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default EmployeeDashboard; 