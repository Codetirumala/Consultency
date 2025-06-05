import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaUser, FaLock, FaBuilding, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ClipLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email });
      
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      // Store user data and token
      login(response.data.user, response.data.token);
      
      // Show success message
      toast.success(`Welcome back, ${response.data.user.name}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Redirect based on user role
      switch (response.data.user.role) {
        case 'ceo':
          navigate('/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        case 'client':
          navigate('/client/dashboard');
          break;
        default:
          navigate('/');
          toast.error('Invalid user role');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
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
      <div className="landing-content">
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Techspot Consulting</h1>
          <p>Transforming businesses through innovative technology solutions and expert consulting services</p>
          <div className="features">
            <motion.div 
              className="feature"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaChartLine className="feature-icon" />
              <h3>Strategic Planning</h3>
              <p>Data-driven business strategies</p>
            </motion.div>
            <motion.div 
              className="feature"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaUsers className="feature-icon" />
              <h3>Expert Team</h3>
              <p>Industry-leading consultants</p>
            </motion.div>
            <motion.div 
              className="feature"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaShieldAlt className="feature-icon" />
              <h3>Secure Platform</h3>
              <p>Enterprise-grade security</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="login-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="login-container">
            <h2>Welcome to Techspot</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="login-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <div className="animation-container">
              <Player
                autoplay
                loop
                src="https://assets2.lottiefiles.com/packages/lf20_kkflmtur.json"
                style={{ height: '180px', width: '180px' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage; 