/**
 * Validation Utility
 * 
 * This utility provides schema validation for database operations
 * using Yup schema validation library.
 */

import * as yup from 'yup';
import { LEAD_STATUS, MEETING_TYPES, DOCUMENT_TYPES, MILESTONE_STATUS } from './constants';

// Helper function to validate data against a schema
export const validateData = async (schema, data) => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    return {
      isValid: true,
      data: validatedData,
      errors: null
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      // Format validation errors
      const errors = error.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      
      return {
        isValid: false,
        data: null,
        errors
      };
    }
    
    // Re-throw unexpected errors
    throw error;
  }
};

// User schema
export const userSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  displayName: yup.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  photoURL: yup.string().url('Invalid URL format'),
  role: yup.string().oneOf(['admin', 'team', 'client', 'investor', 'partner'], 'Invalid role'),
  phone: yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format'),
  company: yup.string().max(100, 'Company name is too long'),
  title: yup.string().max(100, 'Title is too long'),
  bio: yup.string().max(500, 'Bio is too long')
});

// Lead schema
export const leadSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format'),
  company: yup.string().max(100, 'Company name is too long'),
  source: yup.string().required('Source is required'),
  status: yup.string().oneOf(Object.values(LEAD_STATUS), 'Invalid status'),
  notes: yup.string().max(1000, 'Notes are too long'),
  assignedTo: yup.string().nullable(),
  budget: yup.number().positive('Budget must be positive').nullable(),
  timeline: yup.string().max(100, 'Timeline is too long'),
  tags: yup.array().of(yup.string())
});

// Client schema
export const clientSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format'),
  company: yup.string().max(100, 'Company name is too long'),
  clientUserId: yup.string().nullable(),
  assignedTo: yup.string().nullable(),
  notes: yup.string().max(1000, 'Notes are too long'),
  status: yup.string().required('Status is required'),
  startDate: yup.date().nullable(),
  tags: yup.array().of(yup.string()),
  address: yup.object().shape({
    street: yup.string().max(100, 'Street is too long'),
    city: yup.string().max(100, 'City is too long'),
    state: yup.string().max(100, 'State is too long'),
    zip: yup.string().max(20, 'ZIP code is too long'),
    country: yup.string().max(100, 'Country is too long')
  }).nullable()
});

// Investor schema
export const investorSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format'),
  company: yup.string().max(100, 'Company name is too long'),
  investorUserId: yup.string().nullable(),
  assignedTo: yup.string().nullable(),
  notes: yup.string().max(1000, 'Notes are too long'),
  investmentFocus: yup.array().of(yup.string()),
  investmentRange: yup.object().shape({
    min: yup.number().positive('Minimum investment must be positive').nullable(),
    max: yup.number().positive('Maximum investment must be positive').nullable()
  }).nullable(),
  tags: yup.array().of(yup.string())
});

// Partner schema
export const partnerSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format'),
  company: yup.string().max(100, 'Company name is too long'),
  partnerUserId: yup.string().nullable(),
  assignedTo: yup.string().nullable(),
  notes: yup.string().max(1000, 'Notes are too long'),
  partnerType: yup.string().required('Partner type is required'),
  tags: yup.array().of(yup.string())
});

// Meeting schema
export const meetingSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(100, 'Title is too long'),
  description: yup.string().max(1000, 'Description is too long'),
  date: yup.date().required('Date is required'),
  duration: yup.number().positive('Duration must be positive').required('Duration is required'),
  location: yup.string().max(200, 'Location is too long'),
  type: yup.string().oneOf(Object.values(MEETING_TYPES), 'Invalid meeting type'),
  attendees: yup.array().of(yup.string()).min(1, 'At least one attendee is required'),
  notes: yup.string().max(5000, 'Notes are too long'),
  entityType: yup.string().oneOf(['client', 'investor', 'partner', 'lead'], 'Invalid entity type'),
  entityId: yup.string().required('Entity ID is required')
});

// Document schema
export const documentSchema = yup.object().shape({
  name: yup.string().required('Name is required').max(100, 'Name is too long'),
  type: yup.string().oneOf(Object.values(DOCUMENT_TYPES), 'Invalid document type'),
  url: yup.string().url('Invalid URL format').required('URL is required'),
  uploadedBy: yup.string().required('Uploader ID is required'),
  description: yup.string().max(500, 'Description is too long'),
  tags: yup.array().of(yup.string()),
  entityType: yup.string().oneOf(['client', 'investor', 'partner'], 'Invalid entity type'),
  entityId: yup.string().required('Entity ID is required')
});

// Milestone schema
export const milestoneSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(100, 'Title is too long'),
  description: yup.string().max(500, 'Description is too long'),
  dueDate: yup.date().required('Due date is required'),
  status: yup.string().oneOf(Object.values(MILESTONE_STATUS), 'Invalid status'),
  completedDate: yup.date().nullable(),
  assignedTo: yup.string().nullable(),
  entityType: yup.string().oneOf(['client', 'investor', 'partner'], 'Invalid entity type'),
  entityId: yup.string().required('Entity ID is required')
});

// Transcript schema
export const transcriptSchema = yup.object().shape({
  meetingId: yup.string().required('Meeting ID is required'),
  content: yup.string().required('Content is required'),
  speakerLabels: yup.boolean().default(false),
  speakers: yup.array().of(yup.object().shape({
    id: yup.string().required('Speaker ID is required'),
    name: yup.string().required('Speaker name is required')
  })),
  entityType: yup.string().oneOf(['client', 'investor', 'partner'], 'Invalid entity type'),
  entityId: yup.string().required('Entity ID is required')
});

// Company settings schema
export const companySettingsSchema = yup.object().shape({
  name: yup.string().required('Company name is required').max(100, 'Company name is too long'),
  logo: yup.string().url('Invalid URL format'),
  address: yup.object().shape({
    street: yup.string().max(100, 'Street is too long'),
    city: yup.string().max(100, 'City is too long'),
    state: yup.string().max(100, 'State is too long'),
    zip: yup.string().max(20, 'ZIP code is too long'),
    country: yup.string().max(100, 'Country is too long')
  }),
  phone: yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format'),
  email: yup.string().email('Invalid email address'),
  website: yup.string().url('Invalid URL format'),
  socialMedia: yup.object().shape({
    linkedin: yup.string().url('Invalid LinkedIn URL'),
    twitter: yup.string().url('Invalid Twitter URL'),
    facebook: yup.string().url('Invalid Facebook URL'),
    instagram: yup.string().url('Invalid Instagram URL')
  })
});
