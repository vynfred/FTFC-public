import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ClientLogin from './components/auth/ClientLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TeamLogin from './components/auth/TeamLogin';
import DashboardWrapper from './components/common/DashboardWrapper';
import Analytics from './components/Dashboard/Analytics';
import ClientsDashboard from './components/Dashboard/ClientsDashboard';
import CompanySettings from './components/Dashboard/CompanySettings';
import Dashboard from './components/Dashboard/Dashboard';
import InvestorDashboard from './components/Dashboard/InvestorDashboard';
import LeadsDashboard from './components/Dashboard/LeadsDashboard';
import MarketingDashboard from './components/Dashboard/MarketingDashboard';
import PartnerDashboard from './components/Dashboard/PartnerDashboard';
import CssExamples from './components/examples/CssExamples';
import Layout from './components/layout/Layout';
import NotFound from './components/NotFound';
import About from './components/public/About';
import BlogList from './components/public/BlogList';
import BlogPost from './components/public/BlogPost';
import ConsultationPage from './components/public/ConsultationPage';
import Contact from './components/public/Contact';
import Home from './components/public/Home';
import Privacy from './components/public/Privacy';
import Services from './components/public/Services';
import Team from './components/public/Team';
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/team" element={<Team />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/team-login" element={<TeamLogin />} />
        <Route path="/client-login" element={<ClientLogin />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/leads" element={<LeadsDashboard />} />
        <Route path="/dashboard/clients" element={<ClientsDashboard />} />
        <Route path="/dashboard/marketing" element={<MarketingDashboard />} />
        <Route path="/dashboard/investors" element={<InvestorDashboard />} />
        <Route path="/dashboard/partners" element={<PartnerDashboard />} />
        <Route path="/dashboard/company-settings" element={<CompanySettings />} />
        <Route path="/dashboard/css-examples" element={<CssExamples />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;