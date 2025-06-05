import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage on initial load
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // Set default axios authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', token);
    // Set default axios authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    // Remove axios authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      hasRole,
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 