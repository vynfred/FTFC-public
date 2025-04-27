import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, getRedirectResult } from 'firebase/auth';

/**
 * Component to handle Google sign-in redirect results
 * This component should be rendered at the top level of the app
 */
const GoogleRedirectHandler = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(auth);
        
        if (result) {
          // User successfully signed in with redirect
          console.log('User signed in after redirect:', result.user.email);
          
          // Store success flags
          localStorage.setItem('googleSignInSuccess', 'true');
          try {
            sessionStorage.setItem('googleSignInSuccess', 'true');
          } catch (e) {
            console.warn('Could not set sessionStorage item:', e);
          }
          
          // Get the intended role or default to 'team'
          const role = localStorage.getItem('intendedUserRole') || 'team';
          localStorage.setItem('userRole', role);
          try {
            sessionStorage.setItem('userRole', role);
          } catch (e) {
            console.warn('Could not set sessionStorage item:', e);
          }
          
          // Clean up
          localStorage.removeItem('intendedUserRole');
          
          // Navigate to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };
    
    handleRedirectResult();
  }, [auth, navigate]);
  
  // This component doesn't render anything
  return null;
};

export default GoogleRedirectHandler;
