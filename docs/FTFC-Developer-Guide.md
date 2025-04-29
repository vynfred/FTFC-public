# FTFC Application Developer Guide

## Overview

The FTFC (First Time Founder Capital) application is a comprehensive platform designed to help startup founders manage their fundraising process, connect with investors, and track client relationships. This document provides an overview of the application's architecture, functionality, and development guidelines for developers taking over the project.

## Table of Contents

1. [Application Architecture](#application-architecture)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Authentication](#authentication)
6. [Database Structure](#database-structure)
7. [Deployment](#deployment)
8. [Known Issues](#known-issues)
9. [Future Development](#future-development)
10. [Development Guidelines](#development-guidelines)

## Application Architecture

The FTFC application follows a modern React single-page application (SPA) architecture with Firebase as the backend. The application is structured around several key modules:

- **Authentication**: User authentication and authorization
- **Dashboard**: Main interface for users to access different features
- **Leads Management**: Tracking and managing potential clients
- **Client Management**: Managing existing client relationships
- **Investor Management**: Tracking investor relationships and investments
- **Partner Management**: Managing partnerships with other organizations
- **Company Settings**: Configuration options for the organization
- **Public Pages**: Content management for public-facing pages

The application uses a component-based architecture with reusable UI components and follows a modular approach to code organization.

## Key Features

### Dashboard
- Overview of key metrics and statistics
- Quick access to recent activities and important information
- Customizable widgets for different user roles

### Leads Management
- Lead intake form with validation
- Lead tracking and status updates
- Conversion of leads to clients
- Virtual list for efficient rendering of large datasets

### Client Management
- Client profiles with detailed information
- Document management
- Milestone tracking
- Meeting scheduling and notes
- Portal access for clients

### Investor Management
- Investor profiles and relationship tracking
- Investment tracking
- Deal flow management
- Portal access for investors

### Partner Management
- Partner profiles and relationship tracking
- Referral tracking
- Portal access for partners

### Company Settings
- User management
- Role-based access control
- Branding and customization options
- Security settings
- Public page content management

### Meeting Management
- Integration with Google Calendar
- Automatic retrieval of meeting transcripts from Google Drive
- Meeting notes and follow-up tasks

## Technology Stack

### Frontend
- **React**: Core UI library
- **React Router**: Navigation and routing
- **CSS Modules**: Component-scoped styling
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization
- **React Icons**: Icon library

### Backend
- **Firebase**: Backend-as-a-Service platform
  - **Firestore**: NoSQL database
  - **Firebase Authentication**: User authentication
  - **Firebase Storage**: File storage
  - **Firebase Hosting**: Application hosting
  - **Firebase Functions**: Serverless functions

### External Integrations
- **Google Calendar API**: Calendar integration
- **Google Drive API**: Document storage and retrieval
- **Calendly**: Meeting scheduling (planned)

## Project Structure

```
ftfc/
├── docs/                    # Documentation files
├── functions/               # Firebase Cloud Functions
├── public/                  # Public assets
├── src/
│   ├── assets/              # Static assets (images, fonts)
│   ├── components/          # React components
│   │   ├── common/          # Shared/reusable components
│   │   ├── Dashboard/       # Dashboard-related components
│   │   ├── icons/           # Icon components
│   │   ├── layout/          # Layout components
│   │   ├── shared/          # Shared business components
│   │   └── ui/              # UI components (buttons, inputs, etc.)
│   ├── config/              # Configuration files
│   ├── context/             # React context providers
│   ├── firebase-config.js   # Firebase configuration
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── styles/              # Global styles and CSS variables
│   ├── utils/               # Utility functions
│   ├── App.js               # Main App component
│   └── index.js             # Application entry point
├── .env                     # Environment variables (not in repo)
├── .firebaserc              # Firebase project configuration
├── firebase.json            # Firebase configuration
└── package.json             # NPM package configuration
```

## Authentication

### Current Status

The application currently uses Firebase Authentication with email/password login. Google Authentication is planned but not yet implemented in the current build.

### Google Authentication Requirements

Google Authentication is a critical feature that needs to be implemented by the new developer. Here are the requirements:

1. **Implementation Scope**:
   - Enable Google sign-in for team members (FTFC staff)
   - Integrate with Google Calendar and Google Drive APIs
   - Maintain session persistence across page reloads

2. **Technical Requirements**:
   - Use Firebase Authentication with Google provider
   - Implement proper token storage and refresh mechanisms
   - Set up appropriate OAuth scopes for Google Calendar and Drive access
   - Configure proper redirect URLs in Google Console

3. **OAuth Configuration**:
   - Google OAuth client ID: `815508531852-scs6t2uph7ci2vkgpfvn7uq5q7406s20.apps.googleusercontent.com`
   - Redirect URIs: 
     - `https://ftfc.co/api/google/oauth-callback`
     - `https://ftfc-start.web.app/api/google/oauth-callback`
   - Required scopes:
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/drive.readonly`

4. **Implementation Notes**:
   - Use popup authentication flow rather than redirect for better UX
   - Store authentication tokens securely
   - Implement proper error handling for authentication failures
   - Add comprehensive logging for debugging authentication issues

## Database Structure

The application uses Firestore as its primary database. Here's an overview of the main collections:

### Users
- User profiles and authentication information
- Role-based permissions
- Personal preferences

### Leads
- Lead information and contact details
- Status tracking
- Conversion history
- Associated team members

### Clients
- Client profiles and contact information
- Project details and milestones
- Document references
- Meeting history
- Portal access information

### Investors
- Investor profiles and contact information
- Investment history
- Deal flow tracking
- Portal access information

### Partners
- Partner profiles and contact information
- Referral tracking
- Portal access information

### Meetings
- Meeting details and scheduling information
- Attendees and agenda
- Notes and action items
- Transcript references

### Documents
- Document metadata
- Access permissions
- Version history

### Settings
- Company settings and configuration
- Branding information
- Public page content

## Deployment

The application is deployed using Firebase Hosting. Here's an overview of the deployment process:

1. **Build Process**:
   - `npm run build` - Creates a production build
   - `npm run build:small` - Creates an optimized production build with reduced size

2. **Deployment Commands**:
   - `firebase deploy --only hosting` - Deploys only the hosting component
   - `firebase deploy --only functions` - Deploys only the Cloud Functions
   - `firebase deploy` - Deploys all components

3. **Deployment Environments**:
   - Production: `https://ftfc.co`
   - Staging: `https://ftfc-start.web.app`

4. **Environment Variables**:
   - All API keys and sensitive information should be stored in the `.env` file
   - Firebase functions use environment variables set through the Firebase CLI

## Known Issues

1. **FaSearch Reference Error**:
   - Issue: The application was experiencing a "FaSearch is not defined" error in the compiled JavaScript
   - Solution: A custom FaSearch component was created with an inline SVG implementation, and a polyfill was added to the index.html file

2. **Google Authentication**:
   - Issue: Google Authentication is not fully implemented
   - Status: Pending implementation by the new developer

3. **Meeting Transcript Processing**:
   - Issue: Automatic processing of meeting transcripts from Google Drive is not fully implemented
   - Status: Partially implemented, needs completion

4. **Responsive Design**:
   - Issue: Some components may not be fully responsive on all device sizes
   - Status: Ongoing improvement

## Future Development

1. **Google Authentication**:
   - Implement Google sign-in for team members
   - Integrate with Google Calendar and Drive APIs

2. **Meeting Management**:
   - Complete the automatic retrieval and processing of meeting transcripts
   - Enhance meeting scheduling and calendar integration

3. **Client/Investor Portals**:
   - Develop dedicated portals for clients and investors
   - Implement secure document sharing and milestone tracking

4. **Analytics Dashboard**:
   - Enhance data visualization and reporting capabilities
   - Add customizable widgets and filters

5. **Mobile Optimization**:
   - Improve responsive design for mobile devices
   - Consider developing a Progressive Web App (PWA) for better mobile experience

## Development Guidelines

### Code Style and Standards

1. **Component Structure**:
   - Use functional components with hooks
   - Keep components small and focused on a single responsibility
   - Use proper prop validation with PropTypes

2. **CSS Organization**:
   - Use CSS Modules for component-scoped styling
   - Follow BEM naming convention for class names
   - Use CSS variables for theming and consistent values

3. **State Management**:
   - Use React Context for global state
   - Use local state for component-specific state
   - Consider using React Query for data fetching and caching

4. **Error Handling**:
   - Use try/catch blocks for async operations
   - Implement proper error boundaries
   - Provide meaningful error messages to users

5. **Performance Optimization**:
   - Use React.memo for expensive components
   - Implement virtualization for long lists
   - Use code splitting for large components
   - Optimize images and assets

### Development Workflow

1. **Branch Strategy**:
   - Use feature branches for new features
   - Use bugfix branches for bug fixes
   - Use release branches for releases
   - Follow semantic versioning for releases

2. **Testing**:
   - Write unit tests for critical functionality
   - Perform manual testing on all major browsers
   - Test on different device sizes

3. **Documentation**:
   - Document all components and functions
   - Keep this developer guide updated
   - Document any complex business logic

4. **Code Review**:
   - Review all code before merging
   - Use pull requests for code reviews
   - Follow the code style and standards

### Security Best Practices

1. **Authentication and Authorization**:
   - Implement proper authentication and authorization
   - Use Firebase security rules for data access control
   - Validate user permissions on the server side

2. **Data Validation**:
   - Validate all user input
   - Implement schema validation for database operations
   - Sanitize user-generated content

3. **API Security**:
   - Store API keys in environment variables
   - Implement proper CORS policies
   - Use HTTPS for all API requests

4. **Content Security**:
   - Implement Content Security Policy (CSP)
   - Prevent XSS attacks
   - Prevent CSRF attacks

## Conclusion

The FTFC application is a comprehensive platform designed to help startup founders manage their fundraising process. This document provides an overview of the application's architecture, functionality, and development guidelines for developers taking over the project.

For any questions or clarifications, please contact the previous development team or the project manager.

---

Last Updated: June 2024
