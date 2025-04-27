import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MinimalLogin from './components/auth/MinimalLogin';
import MinimalProtectedRoute from './components/auth/MinimalProtectedRoute';
import MinimalDashboard from './components/dashboard/MinimalDashboard';

const MinimalApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/team-login" element={<MinimalLogin />} />
        <Route 
          path="/dashboard" 
          element={
            <MinimalProtectedRoute>
              <MinimalDashboard />
            </MinimalProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/team-login" replace />} />
        <Route path="*" element={<Navigate to="/team-login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MinimalApp;
