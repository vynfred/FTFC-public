import React, { useState } from 'react';
import DailySummary from './DailySummary';
import PipelineView from './PipelineView';
import DashboardStats from './DashboardStats';
import BlogManage from '../BlogManage';
import ReportsPanel from './ReportsPanel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ErrorBoundary from '../ErrorBoundary';
import ErrorMessage from '../ErrorMessage';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <NavLink to="/dashboard" end>Overview</NavLink>
        <NavLink to="/dashboard/pipeline">Pipeline</NavLink>
        <NavLink to="/dashboard/reports">Reports</NavLink>
        <NavLink to="/dashboard/blog">Blog</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={
          <ErrorBoundary>
            <DailySummary />
            <DashboardStats />
          </ErrorBoundary>
        } />
        <Route path="/pipeline" element={
          <ErrorBoundary>
            <PipelineView />
          </ErrorBoundary>
        } />
        <Route path="/reports" element={
          <ErrorBoundary>
            <ReportsPanel />
          </ErrorBoundary>
        } />
        <Route path="/blog/*" element={
          <ErrorBoundary>
            <BlogManage />
          </ErrorBoundary>
        } />
      </Routes>
    </div>
  );
};

export default Dashboard; 