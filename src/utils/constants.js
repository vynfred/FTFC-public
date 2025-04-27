/**
 * Application Constants
 * 
 * This file contains constants used throughout the application.
 */

/**
 * Google OAuth Scopes
 * 
 * These scopes define the permissions requested from Google.
 * Always request the minimum scopes needed for your application.
 */
export const GOOGLE_SCOPES = [
  // Basic profile information
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  
  // Calendar access
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  
  // Drive access (read-only)
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  TEAM: 'team',
  CLIENT: 'client',
  INVESTOR: 'investor',
  PARTNER: 'partner'
};

/**
 * Lead Status Options
 */
export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  WON: 'won',
  LOST: 'lost'
};

/**
 * Meeting Types
 */
export const MEETING_TYPES = {
  INITIAL: 'initial',
  FOLLOW_UP: 'follow_up',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  ONBOARDING: 'onboarding',
  REVIEW: 'review',
  OTHER: 'other'
};

/**
 * Document Types
 */
export const DOCUMENT_TYPES = {
  CONTRACT: 'contract',
  PROPOSAL: 'proposal',
  INVOICE: 'invoice',
  REPORT: 'report',
  OTHER: 'other'
};

/**
 * Milestone Status Options
 */
export const MILESTONE_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled'
};

/**
 * API Error Codes
 */
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'auth/invalid-credentials',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_EMAIL: 'auth/invalid-email',
  
  // Authorization errors
  UNAUTHORIZED: 'auth/unauthorized',
  INSUFFICIENT_PERMISSIONS: 'auth/insufficient-permissions',
  
  // Database errors
  DOCUMENT_NOT_FOUND: 'firestore/document-not-found',
  COLLECTION_NOT_FOUND: 'firestore/collection-not-found',
  
  // API errors
  RATE_LIMIT_EXCEEDED: 'api/rate-limit-exceeded',
  SERVICE_UNAVAILABLE: 'api/service-unavailable',
  NETWORK_ERROR: 'api/network-error',
  TIMEOUT: 'api/timeout'
};

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM D, YYYY',
  DISPLAY_DATETIME: 'MMM D, YYYY h:mm A',
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss.sssZ'
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_USER: 'auth_user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
};
