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
import logo from '../assets/logo.jpg';
import config from '../config';

// Configure axios defaults
axios.defaults.baseURL = config.API_URL;
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
      <div className="landing-content" style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', gap: '3vw' }}>
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: 1 }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            <img src={logo} alt="Techspot Logo" style={{ height: '150px', width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
          <h1 style={{ textAlign: 'center', margin: '0 0 0.5rem 0', fontSize: '3.2rem', fontWeight: 800, lineHeight: 1, position: 'static' }}>Techspot Consulting LLC Portal</h1>
          <style>{`.hero-section h1::after { display: none !important; }`}</style>
          <p style={{ textAlign: 'center', marginBottom: '1.8rem' }}>Transforming businesses through innovative technology solutions and expert consulting services</p>
          <div className="features">
            <motion.div 
              className="feature"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ backgroundColor: 'rgba(119,212,243,0.2)', padding: '20px', borderRadius: '10px' }}
            >
              <FaChartLine className="feature-icon" style={{ color: 'rgb(2,174,238)' }} />
              <h3>Strategic Planning</h3>
              <p>Data-driven business strategies</p>
            </motion.div>
            <motion.div 
              className="feature"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ backgroundColor: 'rgba(119,212,243,0.2)', padding: '20px', borderRadius: '10px' }}
            >
              <FaUsers className="feature-icon" style={{ color: 'rgb(2,174,238)' }} />
              <h3>Expert Team</h3>
              <p>Industry-leading consultants</p>
            </motion.div>
            <motion.div 
              className="feature"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ backgroundColor: 'rgba(119,212,243,0.2)', padding: '20px', borderRadius: '10px' }}
            >
              <FaShieldAlt className="feature-icon" style={{ color: 'rgb(2,174,238)' }} />
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
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2vw' }}
        >
          <div className="login-container" style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(2,174,238,0.10)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1.5px solid rgba(2,174,238,0.10)' }}>
            <h2 style={{ fontWeight: 800, fontSize: '2rem', color: '#223046', marginBottom: '2.5rem', textAlign: 'center', letterSpacing: 0.5 }}>Welcome to Techspot</h2>
            
            {error && <div className="error-message" style={{ marginBottom: 12 }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="input-group" style={{ marginBottom: 18, position: 'relative' }}>
                <FaUser className="input-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgb(2,174,238)', fontSize: 18 }} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: 8, border: '1.5px solid #e0f4fa', fontSize: 16, outline: 'none', marginBottom: 0, transition: 'border 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1.5px solid rgb(2,174,238)'}
                  onBlur={e => e.target.style.border = '1.5px solid #e0f4fa'}
                />
              </div>
              <div className="input-group" style={{ marginBottom: 18, position: 'relative' }}>
                <FaLock className="input-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgb(2,174,238)', fontSize: 18 }} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: 8, border: '1.5px solid #e0f4fa', fontSize: 16, outline: 'none', marginBottom: 0, transition: 'border 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.border = '1.5px solid rgb(2,174,238)'}
                  onBlur={e => e.target.style.border = '1.5px solid #e0f4fa'}
                />
              </div>
              <motion.button
                type="submit"
                className="login-button"
                whileHover={{ scale: 1.02, background: 'rgba(2,174,238,0.85)' }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                style={{ background: 'rgb(2,174,238)', color: '#fff', fontWeight: 700, fontSize: '18px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(2,174,238,0.10)', height: '48px', width: '100%', border: 'none', marginTop: 8, marginBottom: 18, letterSpacing: 0.5, transition: 'background 0.2s' }}
              >
                {loading ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>
            <div className="animation-container" style={{ background: 'rgba(119,212,243,0.15)', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(2,174,238,0.06)', padding: '1.2rem', marginTop: 8, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Player
                autoplay
                loop
                src="https://assets2.lottiefiles.com/packages/lf20_kkflmtur.json"
                style={{ height: '140px', width: '140px' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage; 