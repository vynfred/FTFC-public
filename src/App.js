import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ClientLogin from './components/auth/ClientLogin';
import InvestorLogin from './components/auth/InvestorLogin';
import PartnerLogin from './components/auth/PartnerLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TeamLogin from './components/auth/TeamLogin';
import BlogCreate from './components/blog/BlogCreate';
import BlogEdit from './components/blog/BlogEdit';
import BlogManage from './components/blog/BlogManage';
import DashboardWrapper from './components/common/DashboardWrapper';
import EmailExample from './components/common/EmailExample';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import ScrollToTop from './components/common/ScrollToTop';
import Analytics from './components/Dashboard/Analytics';
import BlogDetail from './components/Dashboard/BlogDetail';
import Calendar from './components/Dashboard/Calendar';
import CampaignDetail from './components/Dashboard/CampaignDetail';
import ClientDetail from './components/Dashboard/ClientDetail';
import ClientsDashboard from './components/Dashboard/ClientsDashboard';
import CompanySettings from './components/Dashboard/CompanySettings';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardWithModules from './components/Dashboard/DashboardWithModules';
import InvestorDashboard from './components/Dashboard/InvestorDashboard';
import InvestorDashboardWithModules from './components/Dashboard/InvestorDashboardWithModules';
import InvestorDetail from './components/Dashboard/InvestorDetail';
import LeadDetail from './components/Dashboard/LeadDetail';
import LeadsDashboard from './components/Dashboard/LeadsDashboard';
import MarketingDashboard from './components/Dashboard/MarketingDashboard';
import MeetingDetail from './components/Dashboard/MeetingDetail';
import PartnerDashboard from './components/Dashboard/PartnerDashboard';
import PartnerDetail from './components/Dashboard/PartnerDetail';
import UserProfile from './components/Dashboard/UserProfile';
import ComponentsExamples from './components/examples/ComponentsExamples';
import CssExamples from './components/examples/CssExamples';
import FormExamples from './components/examples/FormExamples';
import ReferralIntakeForm from './components/forms/ReferralIntakeForm';
import GoogleDriveCallback from './components/integrations/GoogleDriveCallback';
import GoogleOAuthCallback from './components/integrations/GoogleOAuthCallback';
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

// Portal components
import ClientPortal from './components/portals/ClientPortalUpdated';
import InvestorPortal from './components/portals/InvestorPortal';
import PartnerPortal from './components/portals/PartnerPortal';

import { USER_ROLES } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider position="bottomRight">
      {/* ScrollToTop component to handle scrolling on route changes */}
      <ScrollToTop />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

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
          <Route path="/investor-login" element={<InvestorLogin />} />
          <Route path="/partner-login" element={<PartnerLogin />} />

          {/* Referral Intake Form Routes */}
          <Route path="/intake" element={<ReferralIntakeForm />} />
          <Route path="/intake/:type" element={<ReferralIntakeForm />} />
          <Route path="/intake/:type/:referrerId" element={<ReferralIntakeForm />} />

          {/* Google OAuth Callback Routes */}
          <Route path="/api/google/oauth-callback" element={<GoogleOAuthCallback />} />
          <Route path="/api/google-drive/oauth-callback" element={<GoogleDriveCallback />} />
        </Route>

        {/* Client Portal Routes */}
        <Route
          path="/client-portal/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.CLIENT, USER_ROLES.TEAM]} redirectPath="/client-login">
              <ClientPortal />
            </ProtectedRoute>
          }
        />

        {/* Investor Portal Routes */}
        <Route
          path="/investor-portal/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.INVESTOR, USER_ROLES.TEAM]} redirectPath="/investor-login">
              <InvestorPortal />
            </ProtectedRoute>
          }
        />

        {/* Partner Portal Routes */}
        <Route
          path="/partner-portal/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.PARTNER, USER_ROLES.TEAM]} redirectPath="/partner-login">
              <PartnerPortal />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard Routes - Team Members Only */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.TEAM]} redirectPath="/team-login">
              <DashboardWrapper />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardWithModules />} />
          <Route path="/dashboard-old" element={<Dashboard />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/leads" element={<LeadsDashboard />} />
          <Route path="/dashboard/clients" element={<ClientsDashboard />} />
          <Route path="/dashboard/clients/create" element={<ClientCreate />} />
          <Route path="/dashboard/marketing" element={<MarketingDashboard />} />
          <Route path="/dashboard/investors" element={<InvestorDashboard />} />
          <Route path="/dashboard/investors-modules" element={<InvestorDashboardWithModules />} />
          <Route path="/dashboard/partners" element={<PartnerDashboard />} />
          <Route path="/dashboard/company-settings" element={<CompanySettings />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route path="/dashboard/css-examples" element={<CssExamples />} />
          <Route path="/dashboard/form-examples" element={<FormExamples />} />
          <Route path="/dashboard/components-examples" element={<ComponentsExamples />} />
          <Route path="/dashboard/email-example" element={<EmailExample />} />
          <Route path="/dashboard/calendar" element={<Calendar />} />
          <Route path="/dashboard/marketing/content/:id" element={<BlogDetail />} />
          <Route path="/dashboard/marketing/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/dashboard/marketing/create-blog" element={<BlogCreate />} />
          <Route path="/dashboard/marketing/edit-content/:id" element={<BlogCreate />} />
          <Route path="/dashboard/marketing/create-campaign" element={<CampaignDetail />} />
          <Route path="/dashboard/clients/:id" element={<ClientDetail />} />
          <Route path="/dashboard/investors/:id" element={<InvestorDetail />} />
          <Route path="/dashboard/partners/:id" element={<PartnerDetail />} />
          <Route path="/dashboard/leads/:id" element={<LeadDetail />} />
          <Route path="/dashboard/meetings/:id" element={<MeetingDetail />} />

          {/* Blog Management Routes */}
          <Route path="/admin/blog" element={<BlogManage />} />
          <Route path="/admin/blog/create" element={<BlogCreate />} />
          <Route path="/admin/blog/edit/:id" element={<BlogEdit />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
