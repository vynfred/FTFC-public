export const handleError = (error, setError) => {
  console.error('Error:', error);
  if (error.code === 'permission-denied') {
    setError('You do not have permission to perform this action');
  } else if (error.code === 'not-found') {
    setError('The requested resource was not found');
  } else {
    setError('An unexpected error occurred. Please try again.');
  }
}; 