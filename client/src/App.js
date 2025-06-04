import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import CEODashboard from './components/CEODashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import ClientDashboard from './components/client/ClientDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
    <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ceo']}>
                  <CEODashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
    </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
