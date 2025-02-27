export const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.email?.includes('@')) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  return errors;
}; 