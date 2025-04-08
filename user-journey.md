# FTFC User Journey Documentation

This document outlines the various user journeys within the FTFC application, detailing the paths different user types take when interacting with the platform.

## User Types

The FTFC application serves several distinct user types, each with their own journey and access levels:

1. **Public Visitors** - Potential clients or partners browsing the public website
2. **Leads** - Potential clients who have submitted their information
3. **Clients** - Businesses that have engaged FTFC's services
4. **Investors** - Individuals or firms who invest in client companies
5. **Partners** - Organizations that refer leads to FTFC
6. **Team Members** - FTFC staff who manage the platform and client relationships

## Public Visitor Journey

### 1. Website Exploration
- **Entry Point**: Public website (homepage)
- **Actions**:
  - Browse information about FTFC services
  - Read about the team
  - View client testimonials
  - Access educational blog content
- **Goal**: Learn about FTFC's offerings and determine if they meet their needs

### 2. Initial Contact
- **Entry Points**:
  - Contact form
  - Consultation request form
  - Direct email/phone
- **Actions**:
  - Submit contact information
  - Describe business needs
  - Schedule initial consultation
- **Goal**: Establish first contact with FTFC team

### 3. Lead Conversion
- **Entry Points**:
  - Consultation page
  - Referral link from partner/client/team member
- **Actions**:
  - Complete detailed lead form
  - Submit company information
  - Upload pitch deck (if applicable)
  - Provide fundraising goals
- **Goal**: Become a qualified lead in the FTFC system

## Lead Journey

### 1. Lead Intake
- **System Process**:
  - Lead data is processed through LeadProcessingService
  - Contact and company records are created
  - Lead is assigned a status of "New"
  - Source tracking (website form, referral, manual entry)
- **Team Member Actions**:
  - Review new lead information
  - Assign lead to team member
  - Schedule initial call/meeting

### 2. Qualification Process
- **Team Member Actions**:
  - Conduct initial assessment
  - Update lead status (Qualified, Not Qualified)
  - Add notes and next steps
  - Schedule follow-up activities
- **Lead Actions**:
  - Provide additional information as requested
  - Participate in qualification calls
  - Review FTFC services and offerings

### 3. Client Conversion
- **Team Member Actions**:
  - Present service proposal
  - Negotiate terms
  - Convert lead to client in system
- **Lead Actions**:
  - Review and accept proposal
  - Complete client onboarding paperwork
  - Transition to client status

## Client Journey

### 1. Onboarding
- **Team Member Actions**:
  - Set up client account
  - Create client profile
  - Establish goals and KPIs
  - Schedule kickoff meeting
- **Client Actions**:
  - Provide necessary documentation
  - Complete onboarding questionnaires
  - Set up client portal access

### 2. Service Delivery
- **Team Member Actions**:
  - Execute on agreed services
  - Track progress against goals
  - Schedule regular check-ins
  - Update client dashboard
- **Client Actions**:
  - Log into client portal
  - Review progress and metrics
  - Communicate with FTFC team
  - Upload/download documents

### 3. Ongoing Relationship
- **Team Member Actions**:
  - Provide regular updates
  - Suggest additional services
  - Manage client satisfaction
- **Client Actions**:
  - Provide feedback
  - Renew or expand services
  - Refer other potential clients

## Investor Journey

### 1. Investor Registration
- **Entry Points**:
  - Direct invitation from FTFC team
  - Investor portal registration
- **Actions**:
  - Create investor profile
  - Specify investment preferences
  - Connect with FTFC team

### 2. Deal Flow Access
- **Team Member Actions**:
  - Match investors with appropriate deals
  - Share client information (with permission)
  - Facilitate introductions
- **Investor Actions**:
  - Review potential investments
  - Express interest in specific deals
  - Schedule meetings with potential investments

### 3. Investment Process
- **Team Member Actions**:
  - Facilitate due diligence
  - Support negotiation process
  - Track investment status
- **Investor Actions**:
  - Conduct due diligence
  - Make investment decisions
  - Complete investment documentation

## Partner Journey

### 1. Partnership Establishment
- **Entry Points**:
  - Direct outreach
  - Partner program application
- **Actions**:
  - Create partner profile
  - Define partnership terms
  - Set up referral tracking

### 2. Lead Referral
- **Partner Actions**:
  - Identify potential leads
  - Share referral link
  - Provide initial lead information
- **System Process**:
  - Track referral source
  - Associate lead with partner
  - Monitor conversion rates

### 3. Partnership Management
- **Team Member Actions**:
  - Track partner performance
  - Process referral rewards/commissions
  - Maintain partner relationship
- **Partner Actions**:
  - Monitor referral status
  - Access partner dashboard
  - Communicate with FTFC team

## Team Member Journey

### 1. Dashboard Overview
- **Entry Point**: Dashboard home
- **Actions**:
  - View company vitals (KPIs)
  - Check upcoming meetings
  - Review action required items
  - Monitor lead analytics

### 2. Lead Management
- **Entry Point**: Leads dashboard
- **Actions**:
  - View and filter leads
  - Update lead status
  - Add notes and activities
  - Convert qualified leads to clients

### 3. Client Management
- **Entry Point**: Clients dashboard
- **Actions**:
  - Monitor client status
  - Update client information
  - Track client revenue
  - Manage client satisfaction

### 4. Investor Relations
- **Entry Point**: Investors dashboard
- **Actions**:
  - Manage investor profiles
  - Track investment performance
  - Match investors with opportunities
  - Facilitate investor communications

### 5. Partner Management
- **Entry Point**: Partners dashboard
- **Actions**:
  - Track partner referrals
  - Manage partner relationships
  - Process partner commissions
  - Evaluate partner performance

### 6. Content Management
- **Entry Point**: Company Settings
- **Actions**:
  - Update public website content
  - Manage blog posts
  - Edit team information
  - Customize service descriptions

## Authentication Flows

### 1. Team Member Login
- **Entry Point**: Team login page
- **Actions**:
  - Enter email and password
  - Access team dashboard
  - Manage password and account settings

### 2. Client Login
- **Entry Point**: Client login page
- **Actions**:
  - Enter email and password
  - Access client-specific dashboard
  - View limited information relevant to their account

### 3. Investor Login
- **Entry Point**: Investor login page
- **Actions**:
  - Enter email and password
  - Access investor portal
  - View deal flow and investment opportunities

### 4. Partner Login
- **Entry Point**: Partner login page
- **Actions**:
  - Enter email and password
  - Access partner dashboard
  - Track referrals and commissions

## Data Flow Between User Types

### Lead Generation
1. Public visitor submits information via website form
2. System creates lead record
3. Team member reviews and processes lead
4. Lead is either qualified or disqualified
5. Qualified lead converts to client

### Referral Process
1. Partner shares referral link
2. Potential client uses link to submit information
3. System tracks referral source
4. Team member processes lead with referral attribution
5. Partner receives credit for successful conversions

### Investment Flow
1. Team member identifies investment opportunity with client
2. Investor is matched based on preferences
3. Client is introduced to potential investor
4. Investment process is facilitated and tracked
5. Successful investments are recorded in the system

## Contact Ownership

Each contact in the system (leads, clients, investors, partners) has an owner (FTFC team member) to track who brought in the relationship:

- **Lead Owner**: Team member who first engaged with the lead or to whom the lead is assigned
- **Client Owner**: Team member responsible for managing the client relationship
- **Investor Owner**: Team member who brought in the investor or manages the relationship
- **Partner Owner**: Team member who established the partnership or manages the relationship

This ownership tracking ensures proper attribution and relationship management throughout the user journey.

## System Integration Points

### External Systems
- **Email Integration**: For communication and notifications
- **Calendar Integration**: For scheduling meetings and follow-ups
- **Document Storage**: For secure file sharing and management
- **Payment Processing**: For handling client payments and partner commissions

### Internal Processes
- **Lead Scoring**: Automated evaluation of lead quality
- **Activity Logging**: Tracking of all user interactions
- **Notification System**: Alerts for important events and deadlines
- **Reporting Engine**: Generation of performance metrics and analytics

## Future Journey Enhancements

Planned improvements to user journeys:

1. **Automated Onboarding**: Streamlined process for new clients with less manual intervention
2. **Self-Service Portal**: Enhanced client capabilities for managing their own information
3. **Investor Matching Algorithm**: Improved matching of investors to opportunities
4. **Partner Performance Dashboard**: More detailed analytics for partners
5. **Mobile Experience**: Optimized journeys for mobile users
6. **Integration with CRM**: Deeper integration with external CRM systems

---

This document will be updated as user journeys evolve and new features are implemented.
