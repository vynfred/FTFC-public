import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { ToastProvider } from './context/ToastContext';

// Common components (not lazy loaded)
import ProtectedRoute from './components/auth/SimpleProtectedRoute';
import DashboardWrapper from './components/common/DashboardWrapper';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import ScrollToTop from './components/common/ScrollToTop';
import Layout from './components/layout/Layout';

// Loading component
import LoadingScreen from './components/common/LoadingScreen';

// Auth Components

// Modal Components
import AddAttendeeModal from './components/modals/AddAttendeeModal';
import CreateLeadModal from './components/modals/CreateLeadModal';
import ScheduleMeetingModal from './components/modals/ScheduleMeetingModal';
import UploadDocumentModal from './components/modals/UploadDocumentModal';

// Lazy loaded components - Public
const Home = lazy(() => import('./components/public/Home'));
const About = lazy(() => import('./components/public/About'));
const Services = lazy(() => import('./components/public/Services'));
const Team = lazy(() => import('./components/public/Team'));
const BlogList = lazy(() => import('./components/public/BlogList'));
const BlogPost = lazy(() => import('./components/public/BlogPost'));
const Contact = lazy(() => import('./components/public/Contact'));
const ConsultationPage = lazy(() => import('./components/public/ConsultationPage'));
const Privacy = lazy(() => import('./components/public/Privacy'));
const NotFound = lazy(() => import('./components/NotFound'));

// Lazy loaded components - Auth
const TeamLogin = lazy(() => import('./components/auth/SimpleLogin')); // Using simple implementation
const ClientLogin = lazy(() => import('./components/auth/ClientLogin'));
const InvestorLogin = lazy(() => import('./components/auth/InvestorLogin'));
const PartnerLogin = lazy(() => import('./components/auth/PartnerLogin'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const VerifyContact = lazy(() => import('./components/auth/VerifyContact'));
const AuthTest = lazy(() => import('./components/auth/AuthTest'));

// Lazy loaded components - Forms
const ReferralIntakeForm = lazy(() => import('./components/forms/ReferralIntakeForm'));
const LeadFormTest = lazy(() => import('./components/LeadFormTest'));

// Lazy loaded components - Integrations
const GoogleOAuthCallback = lazy(() => import('./components/integrations/GoogleOAuthCallback'));
const GoogleDriveCallback = lazy(() => import('./components/integrations/GoogleDriveCallback'));

// Lazy loaded components - Portals
const ClientPortal = lazy(() => import('./components/portals/ClientPortalUpdated'));
const InvestorPortal = lazy(() => import('./components/portals/InvestorPortal'));
const PartnerPortal = lazy(() => import('./components/portals/PartnerPortal'));

// Lazy loaded components - Dashboard
const DashboardWithModules = lazy(() => import('./components/Dashboard/DashboardWithModules'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Analytics = lazy(() => import('./components/Dashboard/Analytics'));
const LeadsDashboard = lazy(() => import('./components/Dashboard/LeadsDashboard'));
const ClientsDashboard = lazy(() => import('./components/Dashboard/ClientsDashboard'));
const ClientCreate = lazy(() => import('./components/Dashboard/ClientCreate'));
const MarketingDashboard = lazy(() => import('./components/Dashboard/MarketingDashboard'));
const InvestorDashboard = lazy(() => import('./components/Dashboard/InvestorDashboard'));
const InvestorDashboardWithModules = lazy(() => import('./components/Dashboard/InvestorDashboardWithModules'));
const PartnerDashboard = lazy(() => import('./components/Dashboard/PartnerDashboard'));
const CompanySettings = lazy(() => import('./components/Dashboard/CompanySettings'));
const UserProfile = lazy(() => import('./components/Dashboard/UserProfile'));
const CalendarView = lazy(() => import('./components/Dashboard/CalendarView'));

// Lazy loaded components - Detail pages
const ClientDetail = lazy(() => import('./components/Dashboard/ClientDetail'));
const InvestorDetail = lazy(() => import('./components/Dashboard/InvestorDetail'));
const PartnerDetail = lazy(() => import('./components/Dashboard/PartnerDetail'));
const LeadDetail = lazy(() => import('./components/Dashboard/LeadDetail'));
const MeetingDetail = lazy(() => import('./components/Dashboard/MeetingDetail'));
const BlogDetail = lazy(() => import('./components/Dashboard/BlogDetail'));
const CampaignDetail = lazy(() => import('./components/Dashboard/CampaignDetail'));

// Lazy loaded components - Create pages
const LeadCreate = lazy(() => import('./components/Dashboard/LeadCreate'));
const ContactCreate = lazy(() => import('./components/Dashboard/ContactCreate'));
const MeetingCreate = lazy(() => import('./components/Dashboard/MeetingCreate'));
const ProposalCreate = lazy(() => import('./components/Dashboard/ProposalCreate'));

// Lazy loaded components - Blog
const BlogCreate = lazy(() => import('./components/blog/BlogCreate'));
const BlogEdit = lazy(() => import('./components/blog/BlogEdit'));
const BlogManage = lazy(() => import('./components/blog/BlogManage'));

// Lazy loaded components - Examples
const CssExamples = lazy(() => import('./components/examples/CssExamples'));
const FormExamples = lazy(() => import('./components/examples/FormExamples'));
const ComponentsExamples = lazy(() => import('./components/examples/ComponentsExamples'));
const SearchBarExample = lazy(() => import('./components/examples/SearchBarExample'));
const EmailExample = lazy(() => import('./components/common/EmailExample'));
const SimpleDebug = lazy(() => import('./components/Debug/SimpleDebug'));

function App() {
  return (
    <ModalProvider>
      <ToastProvider position="bottomRight">
        {/* ScrollToTop component to handle scrolling on route changes */}
        <ScrollToTop />

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* Session Timeout Warning - Temporarily disabled */}
        {/* <SessionTimeoutWarning /> */}

        <Suspense fallback={<LoadingScreen />}>
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-contact/:contactId/:token" element={<VerifyContact />} />
            <Route path="/auth-test" element={<AuthTest />} />

            {/* Referral Intake Form Routes */}
            <Route path="/intake" element={<ReferralIntakeForm />} />
            <Route path="/intake/:type" element={<ReferralIntakeForm />} />
            <Route path="/intake/:type/:referrerId" element={<ReferralIntakeForm />} />

            {/* Lead Form Test Route */}
            <Route path="/lead-form-test" element={<LeadFormTest />} />
            <Route path="/debug/storage" element={<SimpleDebug />} />

            {/* Google Drive OAuth Callback Route */}
            <Route path="/api/google-drive/oauth-callback" element={<GoogleDriveCallback />} />
          </Route>

        {/* Client Portal Routes */}
        <Route
          path="/client-portal/*"
          element={
            <ProtectedRoute redirectPath="/client-login">
              <ClientPortal />
            </ProtectedRoute>
          }
        />

        {/* Investor Portal Routes */}
        <Route
          path="/investor-portal/*"
          element={
            <ProtectedRoute redirectPath="/investor-login">
              <InvestorPortal />
            </ProtectedRoute>
          }
        />

        {/* Partner Portal Routes */}
        <Route
          path="/partner-portal/*"
          element={
            <ProtectedRoute redirectPath="/partner-login">
              <PartnerPortal />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard Routes - Team Members Only */}
        <Route
          element={
            <ProtectedRoute redirectPath="/team-login">
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
          <Route path="/dashboard/search-example" element={<SearchBarExample />} />
          <Route path="/dashboard/email-example" element={<EmailExample />} />
          <Route path="/dashboard/calendar" element={<CalendarView />} />
          <Route path="/dashboard/marketing/content/:id" element={<BlogDetail />} />
          <Route path="/dashboard/marketing/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/dashboard/marketing/create-blog" element={<BlogCreate />} />
          <Route path="/dashboard/marketing/edit-content/:id" element={<BlogCreate />} />
          <Route path="/dashboard/marketing/create-campaign" element={<CampaignDetail />} />
          <Route path="/dashboard/leads/new" element={<LeadCreate />} />
          <Route path="/dashboard/contacts/new" element={<ContactCreate />} />
          <Route path="/dashboard/meetings/new" element={<MeetingCreate />} />
          <Route path="/dashboard/proposals/new" element={<ProposalCreate />} />
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
      </Suspense>

        {/* Global Modals */}
        <ScheduleMeetingModal />
        <UploadDocumentModal />
        <CreateLeadModal />
        <AddAttendeeModal />
      </ToastProvider>
    </ModalProvider>
  );
}

export default App;
