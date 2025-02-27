import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import TeamLogin from './components/TeamLogin';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Contact from './components/Contact';
import LoadingSpinner from './components/LoadingSpinner';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import './styles/styles.css';

// Lazy load components
const BlogList = lazy(() => import('./components/BlogList'));
const BlogCreate = lazy(() => import('./components/BlogCreate'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const BlogManage = lazy(() => import('./components/BlogManage'));
const DashboardComponent = lazy(() => import('./components/Dashboard/Dashboard'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));
const ConsultationPage = lazy(() => import('./components/ConsultationPage'));
const PipelineView = lazy(() => import('./components/Dashboard/PipelineView'));
const ReportsPage = lazy(() => import('./components/Dashboard/ReportsPage'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navigation />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/consultation" element={<ConsultationPage />} />
              <Route path="/team-login" element={<TeamLogin />} />
              <Route path="/dashboard/*" element={
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<DashboardComponent />} />
                    <Route path="/pipeline" element={<PipelineView />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/blog" element={<BlogManage />} />
                  </Routes>
                </DashboardLayout>
              } />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPortal />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog/create" element={
                <ProtectedRoute>
                  <BlogCreate />
                </ProtectedRoute>
              } />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/blog" element={
                <ProtectedRoute>
                  <BlogManage />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
          <BottomNav />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 