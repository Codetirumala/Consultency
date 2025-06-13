import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import config from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_URL}/api/auth/login`, {
        email,
        password
      });

      login(response.data.user, response.data.token);
      
      // Redirect based on user role
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        switch (response.data.user.role) {
          case 'ceo':
            navigate('/dashboard', { replace: true });
            break;
          case 'employee':
            navigate('/employee/dashboard', { replace: true });
            break;
          case 'client':
            navigate('/client/dashboard', { replace: true });
            break;
          default:
            navigate('/login', { replace: true });
        }
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: 370, maxWidth: '90vw', boxSizing: 'border-box', overflow: 'hidden' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Welcome to Techspot</h2>
        {error && <div className="error" style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon style={{ color: '#bdbdbd' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon style={{ color: '#bdbdbd' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{
              marginTop: 24,
              background: 'linear-gradient(90deg, #02aeee 0%, #77d4f3 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 8,
              boxShadow: 'none',
              height: 48,
            }}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login; 