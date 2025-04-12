/**
 * Password Reset Flow Test
 * 
 * This file contains test cases for the password reset flow.
 * It tests the following scenarios:
 * 1. Requesting a password reset email
 * 2. Handling invalid email addresses
 * 3. Verifying reset codes
 * 4. Setting a new password
 * 5. Handling password validation errors
 * 
 * To run these tests:
 * npm test -- src/tests/passwordReset.test.js
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import { sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
  verifyPasswordResetCode: jest.fn(),
  confirmPasswordReset: jest.fn(),
  getAuth: jest.fn(() => ({}))
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    search: '?oobCode=validCode123'
  })
}));

describe('Password Reset Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ForgotPassword Component', () => {
    test('renders the forgot password form', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <ForgotPassword />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.getByText('Reset Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    test('shows error for empty email', async () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <ForgotPassword />
          </AuthProvider>
        </BrowserRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Please enter your email address')).toBeInTheDocument();
      });
      
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    test('shows success message after sending reset email', async () => {
      sendPasswordResetEmail.mockResolvedValueOnce();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ForgotPassword />
          </AuthProvider>
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'test@example.com' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/we've sent a password reset link/i)).toBeInTheDocument();
      });
      
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'test@example.com');
    });

    test('shows error message when Firebase returns an error', async () => {
      sendPasswordResetEmail.mockRejectedValueOnce({ code: 'auth/user-not-found' });
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ForgotPassword />
          </AuthProvider>
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'nonexistent@example.com' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
      
      await waitFor(() => {
        expect(screen.getByText('No account found with this email address')).toBeInTheDocument();
      });
    });
  });

  describe('ResetPassword Component', () => {
    test('verifies reset code on load', async () => {
      verifyPasswordResetCode.mockResolvedValueOnce('test@example.com');
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ResetPassword />
          </AuthProvider>
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(verifyPasswordResetCode).toHaveBeenCalledWith(expect.anything(), 'validCode123');
      });
      
      expect(screen.getByText(/create a new password for test@example.com/i)).toBeInTheDocument();
    });

    test('shows error for invalid reset code', async () => {
      verifyPasswordResetCode.mockRejectedValueOnce({ code: 'auth/invalid-action-code' });
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ResetPassword />
          </AuthProvider>
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Invalid reset link. Please request a new password reset link.')).toBeInTheDocument();
      });
    });

    test('validates password requirements', async () => {
      verifyPasswordResetCode.mockResolvedValueOnce('test@example.com');
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ResetPassword />
          </AuthProvider>
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      });
      
      fireEvent.change(screen.getByLabelText('New Password'), {
        target: { value: 'weak' }
      });
      
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('Password must contain at least one uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument();
    });

    test('shows error when passwords do not match', async () => {
      verifyPasswordResetCode.mockResolvedValueOnce('test@example.com');
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ResetPassword />
          </AuthProvider>
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      });
      
      fireEvent.change(screen.getByLabelText('New Password'), {
        target: { value: 'StrongPassword123' }
      });
      
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'DifferentPassword123' }
      });
      
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    test('resets password successfully', async () => {
      verifyPasswordResetCode.mockResolvedValueOnce('test@example.com');
      confirmPasswordReset.mockResolvedValueOnce();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <ResetPassword />
          </AuthProvider>
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      });
      
      fireEvent.change(screen.getByLabelText('New Password'), {
        target: { value: 'StrongPassword123' }
      });
      
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'StrongPassword123' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
      
      await waitFor(() => {
        expect(confirmPasswordReset).toHaveBeenCalledWith(
          expect.anything(),
          'validCode123',
          'StrongPassword123'
        );
      });
      
      expect(screen.getByText('Your password has been successfully reset!')).toBeInTheDocument();
    });
  });
});
