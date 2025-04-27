import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoadingScreen from './components/common/LoadingScreen';

// Import the simple login component directly (not lazy loaded)
import SimpleLogin from './components/auth/SimpleLogin';
import SimpleProtectedRoute from './components/auth/SimpleProtectedRoute';

// Lazy load the dashboard
const Dashboard = lazy(() => import('./components/Dashboard/SimpleDashboard'));

const StandaloneApp = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/team-login" element={<SimpleLogin />} />
          <Route
            path="/dashboard"
            element={
              <SimpleProtectedRoute>
                <Dashboard />
              </SimpleProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/team-login" replace />} />
          <Route path="*" element={<Navigate to="/team-login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default StandaloneApp;
