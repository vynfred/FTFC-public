# FTFC Application Page Inventory

This document provides a comprehensive inventory of all pages and their functions in the FTFC application.

## Dashboard Pages

### Sales Dashboard (Home)
- **URL:** `/dashboard`
- **Component:** `SalesDashboard`
- **Functions:**
  - Display company vitals (KPIs)
  - Show upcoming meetings
  - Display action required items (positioned under upcoming meetings)
  - Show lead analytics (conversion funnel, lead sources)
  - Display recent activity
  - Toggle between company/user data

### Marketing Dashboard
- **URL:** `/dashboard/marketing`
- **Component:** `MarketingDashboard`
- **Functions:**
  - Display marketing KPIs
  - Show campaign performance
  - Track content performance
  - Manage marketing budget
  - Display marketing calendar
  - Fixed to company data view

### Leads Dashboard
- **URL:** `/dashboard/leads`
- **Component:** `LeadsDashboard`
- **Functions:**
  - Display lead statistics
  - Show lead pipeline
  - List recent leads
  - Filter leads by status
  - Sort leads by various criteria
  - Toggle between company/user data

### Clients Dashboard
- **URL:** `/dashboard/clients`
- **Component:** `ClientsDashboard`
- **Functions:**
  - Display client statistics
  - Show active clients
  - Track client revenue
  - Monitor client satisfaction
  - List clients with enhanced table styling
  - No date range selector

### Investors Dashboard
- **URL:** `/dashboard/investors`
- **Component:** `InvestorDashboard`
- **Functions:**
  - Display investor statistics
  - Show active investments
  - Track investment performance
  - Monitor investor relations
  - List investors with enhanced table styling
  - No date range selector

### Partners Dashboard
- **URL:** `/dashboard/partners`
- **Component:** `PartnerDashboard`
- **Functions:**
  - Display partner statistics
  - Show active partnerships
  - Track partner performance
  - Monitor partner relations
  - List partners with enhanced table styling
  - No date range selector

### Company Settings
- **URL:** `/dashboard/company-settings`
- **Component:** `CompanySettings`
- **Functions:**
  - Manage company profile
  - Configure user permissions
  - Set notification preferences
  - Customize dashboard appearance
  - Manage integrations
  - Fixed to company data view
  - No date range selector

## Detail Pages

### Lead Detail
- **URL:** `/dashboard/leads/:id`
- **Component:** `LeadDetail`
- **Functions:**
  - View lead information
  - Edit lead details
  - Track lead history
  - Manage lead documents
  - Convert lead to client

### Client Detail
- **URL:** `/dashboard/clients/:id`
- **Component:** `ClientDetail`
- **Functions:**
  - View client information
  - Edit client details
  - Track client history
  - Manage client documents
  - Monitor client projects
  - View meeting transcripts from Gemini

### Investor Detail
- **URL:** `/dashboard/investors/:id`
- **Component:** `InvestorDetail`
- **Functions:**
  - View investor information
  - Edit investor details
  - Track investment history
  - Manage investor documents
  - Monitor investment performance
  - View meeting transcripts from Gemini

### Partner Detail
- **URL:** `/dashboard/partners/:id`
- **Component:** `PartnerDetail`
- **Functions:**
  - View partner information
  - Edit partner details
  - Track partnership history
  - Manage partner documents
  - Monitor partnership performance
  - View meeting transcripts from Gemini

## Public Pages

### Home
- **URL:** `/`
- **Component:** `Home`
- **Functions:**
  - Display company overview
  - Showcase services
  - Feature testimonials
  - Provide call-to-action

### About
- **URL:** `/about`
- **Component:** `About`
- **Functions:**
  - Display company history
  - Showcase company values
  - Introduce leadership team
  - Present company mission and vision

### Team
- **URL:** `/team`
- **Component:** `Team`
- **Functions:**
  - Display team members
  - Showcase team expertise
  - Present team achievements
  - Provide team contact information

### Services
- **URL:** `/services`
- **Component:** `Services`
- **Functions:**
  - Display service offerings
  - Explain service benefits
  - Showcase service case studies
  - Provide service pricing

### Contact
- **URL:** `/contact`
- **Component:** `Contact`
- **Functions:**
  - Display contact information
  - Provide contact form
  - Show office locations
  - Offer support options

### Consultation
- **URL:** `/consultation`
- **Component:** `Consultation`
- **Functions:**
  - Provide consultation booking form
  - Explain consultation process
  - Display consultation benefits
  - Show consultation availability

### Blog
- **URL:** `/blog`
- **Component:** `Blog`
- **Functions:**
  - Display blog posts
  - Filter posts by category
  - Search blog content
  - Show featured articles

### Blog Post
- **URL:** `/blog/:id`
- **Component:** `BlogPost`
- **Functions:**
  - Display blog post content
  - Show related articles
  - Enable social sharing
  - Allow comments

## Integration Features

### Gemini Notes Integration
- **Components:**
  - `MeetingTranscriptList`
  - `MeetingTranscript`
- **Functions:**
  - Automatically process meeting notes created by Google Gemini
  - Extract participant information from notes
  - Determine which client/investor/partner the meeting was with
  - Associate notes with the appropriate entity
  - Display meeting transcripts in client/investor/partner portals
  - Allow team members to view and edit transcripts
- **Authentication Flow:**
  - Only team members need to sign in to Google (not clients/investors/partners)
  - Team members' Google Drives are parsed to collect meeting transcripts
  - Transcripts are stored in the FTFC database
  - Transcripts are displayed in client/investor/partner portals without requiring Google authentication
  - The "Check Gemini Notes" button is only visible to team members

## Authentication Pages

### Login
- **URL:** `/login`
- **Component:** `Login`
- **Functions:**
  - Authenticate users
  - Reset password
  - Remember login

### Register
- **URL:** `/register`
- **Component:** `Register`
- **Functions:**
  - Create new account
  - Verify email
  - Accept terms of service

### Forgot Password
- **URL:** `/forgot-password`
- **Component:** `ForgotPassword`
- **Functions:**
  - Send password reset link
  - Verify identity

### Reset Password
- **URL:** `/reset-password/:token`
- **Component:** `ResetPassword`
- **Functions:**
  - Set new password
  - Confirm password change
